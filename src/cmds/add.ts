import { createCmd } from '../helpers'
import { add } from '../ops/add'

export const addCmd = createCmd(
    'add',
    '<name>',
    'Add package "add <name>" or "add [<@scope>/]<name>" or "add [<@scope>/]<name>@<version>"',
    add
).commander
