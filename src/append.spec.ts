import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from './helpers/spawn-test'
import { getGitFolder } from './helpers'

import config from './config'

const {
    HEX_PATH_CACHE, HEX_CONFIG_PATH
} = config

import * as PKG from '../package.json'
const pkg: any = PKG

const firstLine = `核心 hexin append v${pkg.version}`
const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const folder = getGitFolder(repoUrl)
const repoPath = HEX_PATH_CACHE(folder)

test('Should append', async t => {
    if (shell.test('-d', repoPath) ){
        shell.rm('-rf', repoPath)
    }

    let expectedOutput = [
        firstLine,
        'Repo not exists, cloning...',
        'Running: \'git clone https://github.com/bpmsoasolutions/hexin-modules-test.git your-cache-apth\'',
        'Running: \'yarn\'',
        'Running: \'yarn run lerna bootstrap\'',
        'Running: \'lerna ls --json\'',
        'Packages from hexin-modules-test:',
        '* @bss/utils 1.0.0'
    ]

    let output = await spawn('.', 'node bin/hex.js', 'append', repoUrl)
    output = output.reverse().slice(1).reverse()

    t.deepEqual(output.slice(0, 2), expectedOutput.slice(0, 2))
    t.deepEqual(output.slice(3, 7), expectedOutput.slice(3, 7))

    t.true(shell.test('-d', repoPath))

    expectedOutput = [
        firstLine,
        `Repo already exists, pulling...`,
        `Running: \'git pull\'`,
        `Running: \'yarn\'`,
        `Running: \'yarn run lerna bootstrap\'`,
        `Running: \'lerna ls --json\'`,
        `Packages from hexin-modules-test:`,
        `* @bss/utils 1.0.0`
    ]

    output = await spawn('.', 'node bin/hex.js', 'append', repoUrl)
    t.deepEqual(output.reverse().slice(1).reverse(), expectedOutput)

    t.true(shell.test('-d', repoPath))
})
