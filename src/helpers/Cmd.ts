import chalk from 'chalk'
import * as program from 'commander'
import * as shell from 'shelljs'
import * as fs from 'fs'

import config from '../config'
import { header } from '../helpers'

export class Cli {
    CWD: string
    P: typeof program
    opts: string[][]
    executed: boolean = false
    startTime: Date
    version: string
    error: string | null = null

    constructor(CWD) {
        this.CWD = CWD
        this.P = program
        return this
    }

    define(name, description, version, ...options) {
        this.version = version

        this.P.version(version).description(
            `${chalk.green.bold(name)} ${chalk.white.bold(`v${version}`)} ${
                description
            }`
        )

        options.forEach(opt => this.P.option(...opt.split('|')))
        return this
    }

    exec = () => {
        this.executed = true
    }

    _onStart(name) {
        this.startTime = new Date()
        console.log(header(name))
    }

    _onEnd(...err) {
        let now = new Date()
        let secs = ((now as any) - (this.startTime as any)) / 100

        let msg = ''
        if (err.length > 0) {
            msg = `Error ${chalk.red(err.join(' '))}`
            this.error = msg
        } else {
            msg = `Complete`
        }

        console.log(`${msg} ${chalk.bold(secs.toString())}s`)
    }

    _initCLIFS(program) {
        if (program.home) {
            config.setTestHome(program.home)
        }

        if (!shell.test('-d', config.HEX_PATH())) {
            shell.mkdir(config.HEX_PATH())
        }

        if (!shell.test('-d', config.HEX_PATH_CACHE())) {
            shell.mkdir(config.HEX_PATH_CACHE())
        }

        if (!shell.test('-e', config.HEX_CONFIG_PATH())) {
            console.log('No hexin config, creating one.')
            fs.writeFileSync(config.HEX_CONFIG_PATH(), JSON.stringify({}))
        }
    }

    addCmd({ name, params, description, action }) {
        this.P.command(`${name} ${params}`)
            .description(description)
            .action(async (...args) => {
                this.exec()
                this._initCLIFS(this.P)
                this._onStart(name)

                try {
                    await action({ CWD: this.CWD, program: this.P }, ...args)
                    this._onEnd()
                    process.exit(0)
                } catch (err) {
                    this._onEnd(err)
                    process.exit(1)
                }
            })

        return this
    }

    start() {
        this.P.parse(process.argv)

        if (!this.executed) {
            this._initCLIFS(this.P)
            this.P.outputHelp()
            process.exit(1)
        }
    }
}

export function createCLI(CWD): Cli {
    return new Cli(CWD)
}
