import { release } from '../ops/release'

export const releaseCmd = {
    name: 'release',
    params: '<env> [type]',
    description:'Add new version to the releases branch',
    action: release
}