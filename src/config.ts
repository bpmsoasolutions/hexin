import * as path from 'path'
import * as shortid from 'shortid'

export class Config {
    HEX_DIR: string = '.hexin'
    HEX_FILE: string = 'config.json'
    HEX_DEPS: string = 'hexDependencies'
    TEST_TEMP_PATH: string

    HOME_PATH: string =
        process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']

    HEX_PATH = ():string => path.join(this.HOME_PATH, this.HEX_DIR)

    hexPath = (...dirs):string => path.resolve(this.HEX_PATH(), ...dirs)

    HEX_CONFIG_PATH = ():string => this.hexPath(this.HEX_FILE)

    HEX_PATH_CACHE = (...dirs):string => dirs.length > 0
        ? this.hexPath(...['cache'].concat(dirs))
        : this.hexPath('cache')

    setTestHome = (name) => {
        this.HEX_DIR = name
    }

    fromHome = (...dir) => path.join(this.HOME_PATH, ...dir)

    constructor(){
        this.TEST_TEMP_PATH = `.hexin_cache_${shortid.generate()}`
    }
}

export default new Config()