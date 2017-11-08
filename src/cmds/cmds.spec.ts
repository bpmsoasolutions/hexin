import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from '../helpers/spawn-test'
import { getGitFolder, packageJson, writeJSON } from '../helpers'

import config from '../config'

const {
    HEX_PATH_CACHE, HEX_CONFIG_PATH
} = config

// Repositories for tests
const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const repoUrlProject = 'https://github.com/bpmsoasolutions/hexin-project-test.git'

// Tests Paths
const testHome = path.resolve('_test')
const pathTest = (...dirs) => path.join(testHome, ...dirs)
const folder = getGitFolder(repoUrl)
const repoPath = HEX_PATH_CACHE(folder)

// CLI output Test
const firstLine = (operation) => `核心 hexin ${operation} v${packageJson.version}`


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
        firstLine('append'),
        ...shell.test('-d', repoPath)
            ? secondTime
            : firstTime,
        'Running: \'yarn\'',
        'Running: \'node_modules/.bin/lerna bootstrap\'',
        'Running: \'node_modules/.bin/lerna ls --json\'',
        'Packages from hexin-modules-test:',
        '* @bss/utils 1.0.0'
    ]

test('Should append', async function (t) {
    // Cleaning cache
    await spawn(null, 'trash', config.HEX_PATH())

    // First time

    let expectedOutput = expectedOutputFn()
    let output = await spawn(null, 'hex', 'append', repoUrl)
    output = output.reverse().slice(1).reverse()

    t.deepEqual(output.slice(0, 3), [`No hexin config, creating one.`].concat(expectedOutput).slice(0, 3))
    t.deepEqual(output.slice(4, 7), [`No hexin config, creating one.`].concat(expectedOutput).slice(4, 7))
    t.true(shell.test('-d', repoPath))

    // Second time

    expectedOutput = expectedOutputFn()

    output = await spawn(null, 'hex', 'append', repoUrl)

    t.deepEqual(output.reverse().slice(1).reverse(), expectedOutput)
    t.true(shell.test('-d', repoPath))
})

let addOutput = [
    firstLine('add'),
    'Adding module (bss) utils latest',
    'Checking if it is installed locally',
    'Adding dependency to package.json',
    // 'Saved: .../_test/hexin-project-test/package.json',
]

let addExpectedHexPackages = {
    "hexDependencies": {
        "https://github.com/bpmsoasolutions/hexin-modules-test.git": {
            "@bss/utils": "1.0.0"
        }
    }
}

test('Should add package', async function (t) {
    shell.rm('-rf', pathTest())
    shell.mkdir(pathTest())
    shell.mkdir(pathTest('test'))
    await writeJSON(pathTest('test', 'package.json'), {})

    // First time
    let output = await spawn(pathTest('test'), 'hex', 'add', '@bss/utils')

    t.deepEqual(output.reverse().slice(2).reverse(), addOutput)

    let packageJSON = require(pathTest('test', 'package.json'))

    t.deepEqual(addExpectedHexPackages['hexDependencies'], packageJSON['hexDependencies'])
})

