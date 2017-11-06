import chalk from 'chalk'

export const output = (...msg) => {
    console.log(...msg,'\n')
}

export const start = (cmd, version) => {
    console.log(`${chalk.green.bold('核心 hexin')} ${chalk.bold(cmd)} ${chalk.bold('v' + version)}\n`)
}

export const err = (...msg) => {
    let message = `Error ${msg.join(' ')}`
    console.log(`${chalk.red(message)}\n`)
}