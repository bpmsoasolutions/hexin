import * as shell from 'shelljs'

import { test } from 'ava'
import { spawn } from './helpers/spawn-test'

import config from './config'

const {
    HEX_PATH
} = config

test('Test cmd', async t => {

    let outputExpected = [
        `Usage: hex [options] [command]`,
        `[核心 - Hexin ] Manage monorepos as private packages`,
        `Options:`,
        `-V, --version  output the version number`,
        `--test         Test environment mode`,
        `-h, --help     output usage information`,
        `Commands:`,
        `add <name>             Add package "add <name>" or "add [<@scope>/]<name>" or "add [<@scope>/]<name>@<version>"`,
        `append <git_url_repo>  Download a repo to .hexin cache`,
        `bootstrap              Copy neccesary repos and make yarn and lerna bootstrap`,
        `release <env> [type]   Add new version to the releases branch`,
        `unrelease              Remove specific tags`,
        `clean                  Clean directories and package json`
    ]

    shell.rm('-rf', HEX_PATH())

    let output = await spawn('.', 'hex')
        .then(output=>output, err=>err)
        .catch((err)=>err)

    t.deepEqual(output, [`No hexin config, creating one.`].concat(outputExpected))


    output = await spawn('.', 'hex')
        .then(output=>output, err=>err)
        .catch((err)=>err)

    t.deepEqual(output, outputExpected)
})
