import { createCmd } from '../helpers'
import { clean } from '../ops/clean'

export const cleanCmd = createCmd(
    'clean',
    '',
    'Clean directories and package json',
    clean
).commander
