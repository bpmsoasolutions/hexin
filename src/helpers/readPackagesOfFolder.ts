import * as shell from 'shelljs'
import { readJSON } from '../helpers'

import Config from '../config'
const { hexPath, HEX_PATH_CACHE } = Config
export const readPackagesOfFolder = async parent => {
    let lernaFolder = 'packages'
    return await Promise.all(
        shell.ls(hexPath(HEX_PATH_CACHE(), parent, lernaFolder)).map(folder =>
            readJSON(
                hexPath(
                    HEX_PATH_CACHE(),
                    parent,
                    lernaFolder,
                    folder,
                    'package.json'
                )
            ).then(pkg => {
                return {
                    name: pkg.name,
                    version: pkg.version,
                    folder: folder,
                    parent: parent
                }
            })
        )
    )
}
