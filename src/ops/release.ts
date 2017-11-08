import * as shell from 'shelljs'
import * as path from 'path'

import {
    getGitFolder,
    gitTag,
    readJSON,
    writeJSON,
    pushTag,
    output
} from '../helpers'

export const release = async (CWD, env, type) => {
    if (env === 'node') {
        let pkgPath = path.join(CWD, 'package.json')

        if (!shell.test('-e', pkgPath)) {
            throw 'You are not in a npm module root or this is not a npm package'
        }

        let pkg: any = await readJSON(pkgPath)

        if (!pkg.version) {
            throw 'You are not in a valid package'
        }

        // let pkgName = pkg.name[0] === '@'
        //     ? pkg.name.slice(1)
        //     : pkg.name

        let tag = `${pkg.name}@${pkg.version}`

        output(`Tagging internally ${tag}`)
        await gitTag(tag, CWD)

        output(`Pushing tag ${tag}`)
        await pushTag(tag, CWD)

        output(`Complete`)
    } else {
        throw 'No env found.'
    }
}
