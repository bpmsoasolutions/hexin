import * as path from 'path'
import { getGitFolder, output, err, readJSON, writeJSON } from '../helpers'
import config from '../config'

export const add = async (CWD, pkg: string) => {
    let scope = pkg.match('@(.*?)/')
    let [mod, version] = scope
        ? pkg.slice(scope[0].length).split('@')
        : pkg.split('@')

    output(
        ` Adding module (${scope ? scope[1] : 'no scope'}) ${mod} ${
            version ? version : 'latest'
        }`
    )

    let fullModuleName = `${scope ? scope[0] : ''}${mod}`

    let hexCfg = await readJSON(config.HEX_CONFIG_PATH())

    if (!hexCfg.repos) {
        throw 'Something was wrong, hex file corrupted'
    }

    output(` Checking if it is installed locally`)

    let foundRepoModuleVersion = Object.keys(hexCfg.repos).reduce(
        (acc, val) => {
            let moduleFiltered = hexCfg.repos[val][fullModuleName]
            return moduleFiltered
                ? {
                      url: val,
                      name: fullModuleName,
                      version: moduleFiltered.version
                  }
                : acc ? acc : false
        },
        false
    )

    if (!foundRepoModuleVersion) {
        throw 'Cant find the module locally, try first to append the git repository'
    }

    if (version) {
        // check version
    } else {
        version = (foundRepoModuleVersion as any).version
    }

    output(` Adding dependency to package.json`)
    let pack = await readJSON(path.join(CWD, 'package.json'))

    if (!pack[config.HEX_DEPS]) {
        pack[config.HEX_DEPS] = {}
    }

    if (!pack[config.HEX_DEPS]) {
        pack[config.HEX_DEPS][(foundRepoModuleVersion as any).url] = {}
    }

    let newPkg = {
        [fullModuleName]: version
    }

    pack[config.HEX_DEPS][(foundRepoModuleVersion as any).url] = Object.assign(
        {},
        pack[config.HEX_DEPS][(foundRepoModuleVersion as any).url],
        newPkg
    )

    output(` Saved: ${path.join(CWD, 'package.json')}`)
    await writeJSON(path.join(CWD, 'package.json'), pack)
}
