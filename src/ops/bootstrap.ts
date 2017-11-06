import * as shell from 'shelljs'
import * as path from 'path'

import { readJSON, writeJSON, output, err, getGitFolder, gitCheckout, spawn } from '../helpers'
import config from '../config'

const {
    HEX_DEPS, HEX_CONFIG_PATH, hexPath
} = config

import { append } from './append'

const copyDep = async (CWD, installedPackages, url, name, version): Promise<{}> => {
    let folder = getGitFolder(url)
    let lernaPackages = 'packages'

    let moduleFolder
    try {
        moduleFolder = installedPackages.repos[url][name].folder
    } catch(e){
        throw `Run append, hex config corrupted. ${e}`
    }

    let branch = await spawn(hexPath('cache', folder), 'git', 'branch')
    branch = branch.split('\n')[0].slice(2)

    await gitCheckout(`${name}@${version}`, hexPath('cache', folder))

    output(` Copying module to monorepo`)

    shell.cp('-R', hexPath('cache', folder, lernaPackages, moduleFolder), path.join(CWD, '..'))

    await gitCheckout(branch, hexPath('cache', folder))

    return {
        [name]: version
    }
}
const copyDepsToMonorepo = (CWD, installedPackages, url, modules): Promise<{}>[] => {

    return Object.keys(modules)
        .reduce((acc, val) => {
            acc.push(copyDep(CWD, installedPackages, url, val, modules[val]))
            return acc
        }, [])
}

export const bootstrap = async (CWD) => {

    output(` Reading hex packages from package.json`)
    let pkg = await readJSON(path.join(CWD, 'package.json'))
    let installedPackages = await readJSON(path.join(HEX_CONFIG_PATH()))

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

    output(`Coping packages to monorepo`)
    let newPackages = await Promise.all(
        Object.keys(pkg[HEX_DEPS])
            .reduce((acc, val) => {
                acc = [ ...acc, ...copyDepsToMonorepo(CWD, installedPackages, val, pkg[HEX_DEPS][val]) ]
                return acc
            }, [])
    )

    newPackages = newPackages.reduce((acc,val)=>{
        return Object.assign({}, acc, val)
    },{})

    output(`Refreshing package.json`)
    pkg = await readJSON(path.join(CWD, 'package.json'))
    pkg.dependencies = Object.assign({}, pkg.dependencies, newPackages)
    await writeJSON(path.join(CWD, 'package.json'), pkg)

    output('Bootstraping lerna and yarn')
    await spawn(path.resolve(CWD, '..', '..'), 'yarn')
    await spawn(path.resolve(CWD, '..', '..'), 'yarn', 'run', 'lerna', 'bootstrap')
}