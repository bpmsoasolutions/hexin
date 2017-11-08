import { add , append , bootstrap , clean , release , unrelease } from './ops'

export const addCmd = {
    name: 'add',
    params: '<name>',
    description:'Add package from a repo, previusly downloaded',
    action: add
}

export const appendCmd = {
    name: 'append',
    params: '<git_url_repo>',
    description:'Download a repo to .hexin cache',
    action: append
}

export const bootstrapCmd = {
    name: 'bootstrap',
    params: '',
    description: 'Copy neccesary repos and make yarn and lerna bootstrap',
    action: bootstrap
}

export const cleanCmd = {
    name: 'clean',
    params: '',
    description: 'Clean directories and package json',
    action: clean
}

export const releaseCmd = {
    name: 'release',
    params: '<env> [type]',
    description: 'Add new version to the releases branch',
    action: release
}

export const unreleaseCmd = {
    name: 'unrelease',
    params: '',
    description: 'Remove specific tags',
    action: unrelease
}