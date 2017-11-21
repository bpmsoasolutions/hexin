import * as path from 'path'
import * as shell from 'shelljs'
import { output, err, readJSON, writeJSON } from '../helpers'
import config from '../config'

const { HEX_DEPS, HEX_PATH } = config

export const clean = async ({ CWD }) => {
    let packagePath = path.join(CWD, 'package.json')

    if (!shell.test('-e', packagePath)) {
        output(` Removing hexDependency to package.json`)
        let pack = await readJSON(packagePath)
        if (pack[HEX_DEPS]) {
            delete pack[HEX_DEPS]

            output(` Saved: ${packagePath}`)
            await writeJSON(packagePath, pack)
        } else {
            output(`Skipping no hexDependencies in package.json`)
        }
    } else {
        output(`Skipping no package.json found`)
    }

    output(` Removing .hexin folder`)
    shell.rm('-rf', HEX_PATH())
}
