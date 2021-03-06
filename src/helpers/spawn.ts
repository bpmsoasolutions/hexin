import * as shell from 'shelljs'
import * as path from 'path'
import { output, err } from './'

export const spw = (cwd='.', { verbose }={ verbose: false }, ...args ): Promise<string[]> =>
    new Promise((resolve, reject) => {
        let cmd = args.join(' ')
        let child = shell
            .cd(cwd)
            .exec(cmd, { async: true, silent: !verbose })

        let buffer = []
        child.stderr.on('data', (chunk) => {
            buffer.push(chunk.toString())
        })
        child.stdout.on('data', (chunk) => {
            buffer.push(chunk.toString())
        })
        child.on('close', (code) => {
            if (code) {
                reject(output || `Process failed: ${code}`)
            } else {
                resolve(buffer)
            }
        })
    })

export const sp = (
    cwd: string | null = null,
    exe: string,
    ...args: string[]
): Promise<string> =>
    new Promise((resolve, reject) => {
        let cmd = args.length > 0 ? `${exe} ${args.join(' ')}` : `${exe}`

        output(` Running: '${cmd}' in ${cwd}`)
        let child =
            cwd || cwd !== '.'
                ? shell.cd(cwd).exec(cmd, { async: true, silent: true })
                : shell.exec(cmd, { async: true, silent: true })

        let buffer = []
        child.stderr.on('data', function(chunk) {
            buffer.push(chunk.toString())
        })
        child.stdout.on('data', function(chunk) {
            buffer.push(chunk.toString())
        })
        child.on('close', function(code) {
            let output = buffer.join('')

            if (code) {
                reject(output || `Process failed: ${code}`)
            } else {
                resolve(output)
            }
        })
    })

export const spawn = async (
    cwd: string | null = null,
    exe: string,
    ...args: string[]
): Promise<string> =>
    await sp(cwd, exe, ...args).then(
        res => res,
        err => {
            throw err
        }
    )
