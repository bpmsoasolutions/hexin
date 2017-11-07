import { bootstrap } from '../ops/bootstrap'

export const bootstrapCmd = {
    name: 'bootstrap',
    params: '',
    description:'Copy neccesary repos and make yarn and lerna bootstrap',
    action: bootstrap
}
