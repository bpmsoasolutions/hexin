import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from './helpers/spawn-test'
import { getGitFolder, packageJson } from './helpers'

import config from './config'

const {
    HEX_PATH_CACHE, HEX_CONFIG_PATH
} = config

const firstLine = `核心 hexin append v${packageJson.version}`
const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const folder = getGitFolder(repoUrl)
const repoPath = HEX_PATH_CACHE(folder)

let firstTime = [
    'Repo not exists, cloning...',
    'Running: \'git clone https://github.com/bpmsoasolutions/hexin-modules-test.git your-cache-apth\''
]

let secondTime = [
    `Repo already exists, pulling...`,
    `Running: \'git pull\'`,
]

const expectedOutputFn = () =>
    [
        firstLine,
        ...shell.test('-d', repoPath)
            ? secondTime
            : firstTime,
        'Running: \'yarn\'',
        'Running: \'yarn run lerna bootstrap\'',
        'Running: \'lerna ls --json\'',
        'Packages from hexin-modules-test:',
        '* @bss/utils 1.0.0'
    ]

test('Should append', async function (t) {
    // Cleaning cache

    await spawn('.', 'trash', repoPath)

    // First time

    let expectedOutput = expectedOutputFn()
    let output = await spawn(null, 'hex', 'append', repoUrl)
    output = output.reverse().slice(1).reverse()

    t.deepEqual(output.slice(0, 2), expectedOutput.slice(0, 2))
    t.deepEqual(output.slice(3, 7), expectedOutput.slice(3, 7))
    t.true(shell.test('-d', repoPath))

    // Second time

    expectedOutput = expectedOutputFn()

    output = await spawn(null, 'hex', 'append', repoUrl)

    t.deepEqual(output.reverse().slice(1).reverse(), expectedOutput)
    t.true(shell.test('-d', repoPath))
})
