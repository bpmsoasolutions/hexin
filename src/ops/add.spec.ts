import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from '../helpers/spawn-test'
import { getGitFolder, packageJson, writeJSON, headerClear } from '../helpers'

import config from '../config'

const testHome = path.resolve('_test')
const pathTest = (...dirs) => path.join(testHome, ...dirs)

const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const repoUrlProject =
    'https://github.com/bpmsoasolutions/hexin-project-test.git'

let addOutput = [
    headerClear('add'),
    'Adding module (bss) utils latest',
    'Checking if it is installed locally',
    'Adding dependency to package.json'
    // 'Saved: .../_test/hexin-project-test/package.json',
]

let addExpectedHexPackages = {
    hexDependencies: {
        [repoUrl]: {
            '@bss/utils': '1.0.0'
        }
    }
}

test('Should add package', async function(t) {
    const hexHomeTest = config.TEST_TEMP_PATH

    shell.rm('-rf', pathTest())
    shell.mkdir(pathTest())
    shell.mkdir(pathTest('test'))

    await writeJSON(pathTest('test', 'package.json'), {})
    await spawn(null, 'hex', `--home ${hexHomeTest}`, 'append', repoUrl)

    // First time
    let output = await spawn(
        pathTest('test'),
        'hex',
        `--home ${hexHomeTest}`,
        'add',
        '@bss/utils'
    )

    t.deepEqual(
        output
            .reverse()
            .slice(2)
            .reverse(),
        addOutput
    )

    let packageJSON = require(pathTest('test', 'package.json'))

    t.deepEqual(
        addExpectedHexPackages['hexDependencies'],
        packageJSON['hexDependencies']
    )

    shell.rm('-rf', hexHomeTest)
})
