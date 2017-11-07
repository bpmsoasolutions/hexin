import { unrelease } from '../ops/unrelease'

export const unreleaseCmd = {
    name: 'unrelease',
    params: '',
    description: 'Remove specific tags',
    action: unrelease
}