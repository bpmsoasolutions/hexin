import * as shell from 'shelljs'
import * as fs from 'fs'

import config from '../config'
const { HEX_CONFIG_PATH, HEX_PATH, HEX_PATH_CACHE } = config

export function initHexinFolder() {
    if (!shell.test('-d', HEX_PATH())) {
        shell.mkdir(HEX_PATH())
    }

    if (!shell.test('-d', HEX_PATH_CACHE())) {
        shell.mkdir(HEX_PATH_CACHE())
    }

    if (!shell.test('-e', HEX_CONFIG_PATH())) {
        console.log('No hexin config, creating one.')
        fs.writeFileSync(HEX_CONFIG_PATH(), '{}')
    }
}
