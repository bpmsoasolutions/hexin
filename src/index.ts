import * as program from 'commander'
import * as updateNotifier from 'update-notifier'
import * as shell from 'shelljs'
import * as path from 'path'
import * as json from 'jsonfile'

import chalk from 'chalk'

import * as PKG from '../package.json'
import config from './config'
import { exec, output, err, initHexinFolder } from './helpers'

const {
    HEX_DIR,
    HOME_PATH,
    HEX_CONFIG_PATH,
    HEX_PATH,
    HEX_PATH_CACHE
} = config

import * as CMDS from './cmds'

const pkg: any = PKG

updateNotifier({ pkg }).notify()

let CWD = process.cwd()

program
    .version(pkg.version)
    .description(`${chalk.green.bold('[核心 - Hexin ]')} Manage multirepos as packages`)
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
