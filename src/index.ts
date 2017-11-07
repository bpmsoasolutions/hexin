import * as updateNotifier from 'update-notifier'

import { addCmd, appendCmd, bootstrapCmd, cleanCmd, releaseCmd, unreleaseCmd} from './cmds'
import { packageJson, createCLI } from './helpers'

updateNotifier({ pkg: packageJson }).notify()

createCLI(process.cwd())
    .define(
        `[ 核心 - Hexin ]`,
        'Manage monorepos as private packages',
        packageJson.version,
        '--test <name>|Test environment mode, this change the .hexin folder, usefull for paralelize tests'
    )
    .addCmd(addCmd)
    .addCmd(appendCmd)
    .addCmd(bootstrapCmd)
    .addCmd(releaseCmd)
    .addCmd(unreleaseCmd)
    .addCmd(cleanCmd)
    .start()