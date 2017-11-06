import chalk from 'chalk'

export class Command {
    version: string
    name: string
    params: string
    description: string
    action: Function

    start: Date

    constructor(name, params, description, action) {
        this.name = name
        this.params = params
        this.description = description
        this.action = action
    }

    outputErr = (...msg) => {
        let message = `Error ${msg.join(' ')}`
        console.log(`${chalk.red(message)}`)
        this.onEnd()
    }

    onStart = () => {
        this.start = new Date()
        console.log(`${chalk.green.bold('核心 hexin')} ${chalk.bold(this.name)} ${chalk.bold('v' +  this.version)}`)
    }

    onEnd = () => {
        let now = new Date()
        let secs = ((now as any) - (this.start as any)) / 100
        console.log(`Complete ${chalk.bold(secs.toString())}s`)
    }

    commander = (program, exec, CWD) => {
        this.version = program._version
        return program
            .command(`${this.name} ${this.params}`)
            .description(this.description)
            .action((...args) => {
                this.onStart()


                this.action(CWD, ...args)
                    .then(
                        ()=> {
                            this.onEnd()
                        },
                        error => {
                            this.outputErr(error)
                        }
                    )
                    .catch(error => {
                        this.outputErr(error)
                    })

                exec.on()
            })
    }
}


export function createCmd(name, params, description, action) {
    let CMD = new Command(name, params, description, action)
    return CMD
}