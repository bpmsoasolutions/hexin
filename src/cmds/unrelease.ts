import { createCmd } from '../helpers'
import { unrelease } from '../ops/unrelease'

export const unreleaseCmd = createCmd(
    'unrelease',
    '',
    'Remove specific tags',
    unrelease
).commander