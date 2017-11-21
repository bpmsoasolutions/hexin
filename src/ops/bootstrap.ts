import * as shell from 'shelljs'
import * as path from 'path'

import {
    readJSON,
    writeJSON,
    readFile,
    writeFile,
    output,
    err,
    getGitFolder,
    gitCheckout,
    spawn,
    spw
} from '../helpers'
import config from '../config'

const { HEX_DEPS, HEX_CONFIG_PATH, hexPath } = config

import { append } from './append'

const copyDep = async (
    CWD,
    installedPackages,
    url,
    name,
    version
): Promise<{}> => {
    let folder = getGitFolder(url)
    let lernaPackages = 'packages'

    let moduleFolder
    try {
        moduleFolder = installedPackages.repos[url][name].folder
    } catch (e) {
        throw `Run append, hex config corrupted. ${e}`
    }

    let branch = await spawn(hexPath('cache', folder), 'git', 'branch')
    branch = branch.split('\n')[0].slice(2)

    await gitCheckout(`${name}@${version}`, hexPath('cache', folder))

    output(` Copying module to monorepo`)

    shell.cp(
        '-R',
        hexPath('cache', folder, lernaPackages, moduleFolder),
        path.resolve(CWD, '..')
    )

    let gitignore = []
    try {
        let cache = await readFile(path.resolve(CWD, '..', '..', '.gitignore'))
        gitignore = cache.split('\n')
    } catch(err) {
    }

    if (gitignore.indexOf([lernaPackages, moduleFolder].join('/')) === -1) {
        gitignore.push([lernaPackages, moduleFolder].join('/'))
        await writeFile(path.resolve(CWD, '..', '..', '.gitignore'), gitignore.join('\n'))
    }

    await gitCheckout(branch, hexPath('cache', folder))

    return {
        [name]: `^${version}`
    }
}
const copyDepsToMonorepo = (
    CWD,
    installedPackages,
    url,
    modules
): Promise<{}>[] => {
    return Object.keys(modules).reduce((acc, val) => {
        acc.push(copyDep(CWD, installedPackages, url, val, modules[val]))
        return acc
    }, [])
}

export const bootstrap = async ({ CWD, program }) => {
    output(` Reading hex packages from package.json`)
    let pkg = await readJSON(path.join(CWD, 'package.json'))

    if (!pkg[HEX_DEPS]) {
        throw `Nothing to bootstrap`
    }

    output(` Refreshing repositories`)
    let gitUrls = Object.keys(pkg[HEX_DEPS])

    await Promise.all(
        gitUrls.map(url => {
            output(`Append ${url}`)
            return append(CWD, url)
        })
    )

    let installedPackages = await readJSON(HEX_CONFIG_PATH())

    output(`Coping packages to monorepo`)
    let newPackages = await Promise.all(
        Object.keys(pkg[HEX_DEPS]).reduce((acc, val) => {
            acc = [
                ...acc,
                ...copyDepsToMonorepo(
                    CWD,
                    installedPackages,
                    val,
                    pkg[HEX_DEPS][val]
                )
            ]
            return acc
        }, [])
    )

    newPackages = newPackages.reduce((acc, val) => {
        return Object.assign({}, acc, val)
    }, {})

    output(`Add 'hexin packages' to package.json`)
    pkg = await readJSON(path.join(CWD, 'package.json'))
    let depsCache = pkg.dependencies
    pkg.dependencies = Object.assign({}, pkg.dependencies, newPackages)
    await writeJSON(path.join(CWD, 'package.json'), pkg)

    output('Bootstraping yarn workspaces')
    await spw(
        path.resolve(CWD, '..', '..'),
        program,
        'yarn',
        'install'
    )

    // output(`Remove 'hexin packages' from package.json`)
    // pkg = await readJSON(path.join(CWD, 'package.json'))
    // pkg.dependencies = depsCache
    // await writeJSON(path.join(CWD, 'package.json'), pkg)
}
