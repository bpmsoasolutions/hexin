import { createCmd } from '../helpers'
import { append } from '../ops/append'

export const appendCmd = createCmd(
    'append',
    '<git_url_repo>',
    'Download a repo to .hexin cache',
    append
).commander