import * as shell from 'shelljs'

import { test } from 'ava'
import { spawn } from './helpers/spawn-test'
import { packageJson } from './helpers'

import config from './config'

test('Test cmd', async t => {

    let outputExpected = [
        `Usage: hex [options] [command]`,
        `[ 核心 - Hexin ] v${packageJson.version} Manage monorepos as private packages`,
        `Options:`,
        `-V, --version  output the version number`,
        `--home <name>  Change hexin cache folder`,
        `-h, --help     output usage information`,
        `Commands:`,
        `add <name>             Add package from a repo, previusly downloaded`,
        `append <git_url_repo>  Download a repo to .hexin cache`,
        `bootstrap              Copy neccesary repos and make yarn and lerna bootstrap`,
        `release <env> [type]   Add new version to the releases branch`,
        `unrelease              Remove specific tags`,
        `clean                  Clean directories and package json`
    ]

    await spawn(null, 'trash', config.HEX_PATH())

    let output = await spawn(null, 'hex')
        .then(output=>output, err=>err)
        .catch((err)=>err)

    t.deepEqual(output, [`No hexin config, creating one.`].concat(outputExpected))


    output = await spawn(null, 'hex')
        .then(output=>output, err=>err)
        .catch((err)=>err)

    t.deepEqual(output, outputExpected)

    output = await spawn(null, 'hex')
    .then(output=>output, err=>err)
    .catch((err)=>err)

    t.deepEqual(output, outputExpected)
})
