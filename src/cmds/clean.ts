import { clean } from '../ops/clean'

export const cleanCmd = {
    name: 'clean',
    params: '',
    description: 'Clean directories and package json',
    action: clean
}
