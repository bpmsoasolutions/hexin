import * as shell from 'shelljs'
import * as path from 'path'
import * as json from 'jsonfile'

import config from '../config'

import {
    getGitFolder,
    gitPull,
    gitClone,
    readJSON,
    writeJSON,
    spawn,
    output,
    err,
    readPackagesOfFolder
} from '../helpers'

export const append = async ({ CWD }, gitUrlRepo) => {
    let folder = getGitFolder(gitUrlRepo)

    let repoPath = path.join(config.HEX_PATH_CACHE(), folder)

    if (shell.test('-d', repoPath)) {
        output(' Repo already exists, pulling...')
        await gitPull(repoPath)
    } else {
        output(' Repo not exists, cloning...')
        await gitClone(gitUrlRepo, repoPath)
    }

    await spawn(repoPath, 'yarn', 'install')
    await spawn(
        repoPath,
        path.join('node_modules', '.bin', 'lerna'),
        'bootstrap'
    )
    let packages: string = await spawn(
        repoPath,
        path.join('node_modules', '.bin', 'lerna'),
        'ls',
        '--json'
    )
    let packagesArray: { name: string; version: string; private: Boolean }[]
    let outputCleaned: string

    try {
        outputCleaned = packages
            .split('\n')
            .slice(1)
            .reverse()
            .slice(1)
            .reverse()
            .join('')
        packagesArray = JSON.parse(outputCleaned)
    } catch (err) {
        throw `Cant parse output from 'lerna ls --json'.
        Output: ${packages}
        OutputCleaned: ${outputCleaned}
        Err: ${err}`
    }

    let cfg = await readJSON(config.HEX_CONFIG_PATH())

    if (!cfg.repos) {
        cfg.repos = {}
    }

    let pkgsRead = await readPackagesOfFolder(folder)

    cfg.repos[gitUrlRepo] = pkgsRead.reduce(
        (
            acc,
            val: {
                name: string
                folder: string
                parent: string
                version: string
            }
        ) => {
            acc[val.name] = {
                name: val.name,
                folder: val.folder,
                parent: val.parent,
                version: val.version
            }
            return acc
        },
        {}
    )

    await writeJSON(config.HEX_CONFIG_PATH(), cfg)

    output(` Packages from ${folder}:`)
    packagesArray.forEach(el => {
        output(` * ${el.name} ${el.version}`)
    })
}
