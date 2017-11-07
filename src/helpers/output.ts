import chalk from 'chalk'
import {packageJson} from './'
export const output = (...msg) => {
    console.log(...msg)
}

export const start = (cmd, version) => {
    console.log(`${chalk.green.bold('核心 hexin')} ${chalk.bold(cmd)} ${chalk.bold('v' + packageJson.version)}`)
}

export const err = (...msg) => {
    let message = `Error ${msg.join(' ')}`
    console.log(`${chalk.red(message)}`)
}