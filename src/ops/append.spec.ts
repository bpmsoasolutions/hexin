import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from '../helpers/spawn-test'
import { getGitFolder, packageJson, writeJSON, headerClear } from '../helpers'

import config from '../config'

// Repositories for tests
const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const repoUrlProject =
    'https://github.com/bpmsoasolutions/hexin-project-test.git'

test('Should append', async function(t) {
    const hexHomeTest = config.TEST_TEMP_PATH
    const folder = getGitFolder(repoUrl)
    const repoPath = config.fromHome(hexHomeTest, 'cache', folder)
    const expectedOutputFn = () => [
        `No hexin config, creating one.`,
        headerClear('append'),
        ...(shell.test('-d', repoPath)
            ? [`Repo already exists, pulling...`, `Running: \'git pull\'`]
            : [
                  'Repo not exists, cloning...',
                  `Running: \'git clone ${repoUrl} ${repoPath}\'`
              ]),
        "Running: 'yarn install'",
        `Running: \'node_modules/.bin/lerna bootstrap\'`,
        `Running: \'node_modules/.bin/lerna ls --json\'`,
        'Packages from hexin-modules-test:',
        '* @bss/utils 1.0.0'
    ]

    // First time
    let expectedOutput = expectedOutputFn()
    let output = await spawn(
        null,
        'hex',
        `--home ${hexHomeTest}`,
        'append',
        repoUrl
    )
    output = output
        .reverse()
        .slice(1)
        .reverse()

    t.deepEqual(output.slice(0, 3), expectedOutput.slice(0, 3))
    t.deepEqual(output.slice(4, 7), expectedOutput.slice(4, 7))

    t.true(shell.test('-d', repoPath))

    // Second time

    expectedOutput = expectedOutputFn()

    output = await spawn(
        null,
        'hex',
        `--home ${hexHomeTest}`,
        'append',
        repoUrl
    )

    t.deepEqual(
        output
            .reverse()
            .slice(1)
            .reverse(),
        expectedOutput.slice(1)
    )
    t.true(shell.test('-d', repoPath))

    shell.rm('-rf', hexHomeTest)
})
