import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from '../helpers/spawn-test'
import { getGitFolder, packageJson, writeJSON } from '../helpers'

import config from '../config'

// Repositories for tests
const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const repoUrlProject = 'https://github.com/bpmsoasolutions/hexin-project-test.git'

// Tests Paths
const testHome = path.resolve('_test')
const pathTest = (...dirs) => path.join(testHome, ...dirs)
const folder = getGitFolder(repoUrl)
const repoPath = config.HEX_PATH_CACHE(folder)

// CLI output Test
const firstLine = (operation) => `核心 hexin ${operation} v${packageJson.version}`

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

