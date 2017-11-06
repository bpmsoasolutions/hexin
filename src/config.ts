import * as path from 'path'

export class Config {
    HEX_DIR: string = '.hexin'
    HEX_DIR_TEST: string = '.hexin_test'
    HEX_FILE: string = 'config.json'
    HEX_DEPS: string = 'hexDependencies'

    HOME_PATH: string =
        process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']

    HEX_PATH = ():string => path.join(this.HOME_PATH, this.HEX_DIR)
    HEX_CONFIG_PATH = ():string => path.join(this.HOME_PATH, this.HEX_DIR, this.HEX_FILE)
    HEX_PATH_CACHE = ():string => path.join(this.HOME_PATH, this.HEX_DIR, 'cache')

    hexPath = (...dirs):string => path.resolve(this.HEX_PATH, ...dirs)

    setTestHome = () => {
        this.HEX_DIR = this.HEX_DIR_TEST
    }
}

export default new Config()