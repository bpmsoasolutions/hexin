import * as shell from 'shelljs'
import {output, err} from './'

export const sp = (cwd:string | null = null, exe: string, ...args: string[] ): Promise<string> => {
    return new Promise(function(resolve, reject) {
        let cmd = `${exe} ${args.join(' ')}`
        output(` Running: '${cmd}'`)
        var child = cwd || cwd !== '.'
            ? shell.cd(cwd).exec(cmd, {async:true, silent: true})
            : shell.exec(cmd, {async:true, silent: true})

        var buffer = []
        child.stderr.on('data', function(chunk) {
            buffer.push(chunk.toString())
        })
        child.stdout.on('data', function(chunk) {
            buffer.push(chunk.toString())
        })
        child.on('close', function(code) {
            var output = buffer.join('')
            if (code) {
                reject(output || `Process failed: ${code}`)
            } else {
                resolve(output)
            }
        })
    })
}

export const spawn = async (cwd:string | null = null, exe: string, ...args: string[] ): Promise<string> =>
    await sp(cwd, exe, ...args)
        .then(
            res=>res,
            err=> {
                throw err
            }
        )