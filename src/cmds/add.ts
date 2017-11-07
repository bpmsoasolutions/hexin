import { add } from '../ops/add'

export const addCmd = {
    name: 'add',
    params: '<name>',
    description:'Add package "add <name>" or "add [<@scope>/]<name>" or "add [<@scope>/]<name>@<version>"',
    action: add
}
