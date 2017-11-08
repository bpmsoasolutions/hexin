import * as fs from 'fs'

export const writeFile = (path, string) =>
    new Promise((resolve, reject) =>
        fs.writeFile(path, string, err => (err ? reject(err) : resolve()))
    )

export const readFile = path =>
    new Promise((resolve, reject) =>
        fs.readFile(
            path,
            (err, string) => (err ? reject(err) : resolve(string))
        )
    )

export const readJSON = async path => {
    let string = await readFile(path)
    return JSON.parse(string as string)
}

export const writeJSON = async (path, json) => {
    let string = JSON.stringify(json, null, 4)
    return await writeFile(path, string)
}
