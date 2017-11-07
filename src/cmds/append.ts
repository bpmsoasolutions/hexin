import { append } from '../ops/append'

export const appendCmd = {
    name: 'append',
    params: '<git_url_repo>',
    description:'Download a repo to .hexin cache',
    action: append
}