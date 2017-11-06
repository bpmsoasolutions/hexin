import { createCmd } from '../helpers'
import { release } from '../ops/release'

export const releaseCmd = createCmd(
    'release',
    '<env> [type]',
    'Add new version to the releases branch',
    release
).commander
