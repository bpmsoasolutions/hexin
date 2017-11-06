import {spawn} from './'

export const lernaReadPackages = async (pathToLernaRepo) => {
    let pkgs = await spawn(pathToLernaRepo, 'lerna', 'ls', '--json')
    console.log(pkgs)
}