import * as path from 'path'
import * as shell from 'shelljs'
import { test } from 'ava'

import { spawn } from '../helpers/spawn-test'
import { getGitFolder, packageJson, writeJSON, readJSON, headerClear, outputPaths } from '../helpers'

import config from '../config'

// Repositories for tests
const repoUrl = 'https://github.com/bpmsoasolutions/hexin-modules-test.git'
const repoUrlProject =
    'https://github.com/bpmsoasolutions/hexin-project-test.git'

test('Should bootstrap', async function(t) {
    const hexHomeTest = config.TEST_TEMP_PATH
    const folder = getGitFolder(repoUrl)
    const repoPath = config.fromHome(hexHomeTest, 'cache', folder)

    let expectedOutput = [
        'No hexin config, creating one.',
        headerClear('bootstrap'),
        'Reading hex packages from package.json',
        'Refreshing repositories',
        'Append https://github.com/bpmsoasolutions/hexin-modules-test.git',
        ...(shell.test('-d', repoPath)
            ? [`Repo already exists, pulling...`, `Running: \'git pull\'`]
            : [
                'Repo not exists, cloning...',
                `Running: \'git clone ${repoUrl} ${repoPath}\'`
            ]),
        'Running: \'yarn install\'',
        `Running: \'${outputPaths('node_modules', '.bin', 'lerna')} bootstrap\'`,
        `Running: \'${outputPaths('node_modules', '.bin', 'lerna')} ls --json\'`,
        'Packages from hexin-modules-test:',
        '* @bss/utils 1.0.0',
        'Coping packages to monorepo',
        'Running: \'git branch\'',
        'Running: \'git checkout @bss/utils@1.0.0\'',
        'Copying module to monorepo',
        'Running: \'git checkout master\'',
        'Add \'hexin packages\' to package.json',
        'Bootstraping lerna and yarn',
        'Running: \'yarn\'',
        'Running: \'yarn run lerna bootstrap\'',
        'Remove \'hexin packages\' from package.json'
    ]

    shell.mkdir(config.fromHome(hexHomeTest))
    await spawn(null, 'git', 'clone', repoUrlProject, config.fromHome(hexHomeTest, '_test'))

    let output = await spawn(
        config.fromHome(hexHomeTest, '_test', 'packages', 'core'),
        'hex',
        `--home ${hexHomeTest}`,
        'bootstrap',
        repoUrl
    )

    t.deepEqual(output.reverse().slice(1).reverse(), expectedOutput)

    let packageJSONProyect = await readJSON(config.fromHome(hexHomeTest, '_test', 'packages', 'core', 'package.json'))

    t.true(Object.keys(packageJSONProyect.dependencies).indexOf('@bss/utils') === -1)
    t.true(Object.keys(packageJSONProyect[config.HEX_DEPS][repoUrl]).indexOf('@bss/utils') > -1)
    t.true(shell.test('-d', config.fromHome(hexHomeTest, '_test', 'packages', 'test-utils')))
    t.true(shell.test('-d', config.fromHome(hexHomeTest, '_test', 'node_modules', '@bss', 'utils')))

    shell.rm('-rf', hexHomeTest)
})
