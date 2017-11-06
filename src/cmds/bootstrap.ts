import { createCmd } from '../helpers'
import { bootstrap } from '../ops/bootstrap'

export const bootstrapCmd = createCmd(
    'bootstrap',
    '',
    'Copy neccesary repos and make yarn and lerna bootstrap',
    bootstrap
).commander
