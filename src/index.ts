import * as program from 'commander'
import * as updateNotifier from 'update-notifier'
import * as shell from 'shelljs'
import * as path from 'path'
import * as json from 'jsonfile'
import chalk from 'chalk'

import * as CMDS from './cmds'
import config from './config'
import { exec, output, err, initHexinFolder, packageJson } from './helpers'

const {
    HEX_DIR,
    HOME_PATH,
    HEX_CONFIG_PATH,
    HEX_PATH,
    HEX_PATH_CACHE
} = config


updateNotifier({ pkg: packageJson }).notify()

let CWD = process.cwd()

program
    .version(packageJson.version)
    .description(`${chalk.green.bold(`[ 核心 - Hexin ]`)} ${chalk.white.bold('v' + packageJson.version)} Manage monorepos as private packages `)
    .option('--test', 'Test environment mode')

if (process.argv.indexOf('--test') > 0) {
    config.setTestHome()
}

initHexinFolder()

Object.keys(CMDS)
    .forEach(k => {
        CMDS[k].call(null, program, exec, CWD)
    })

program.parse(process.argv)

if (!exec.is()) {
    program.outputHelp()
    process.exit(1)
}
