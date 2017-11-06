import * as shell from 'shelljs'
import * as  path from 'path'
import * as  util from 'util'

import { spawn, output } from './'


export const getGitFolder = (str:string): string => {
    var pattern = new RegExp(`\/(.*?)\.git`,'i')
    if (!pattern.exec(str)){
        throw `this is not a correct git repo url '${str}'`
    }
    return pattern.exec(str)[1]
}

export const gitGetTag = (pathToDir?) =>
    (...args) =>
        spawn(pathToDir, 'git tag', ...args)

export const getTags = async (pathToDir?) => {
    let tags: any = await gitGetTag(pathToDir)()
    tags = tags.split('\n').filter(e =>e!=='')
    return tags
}

export const removeRemoteTag = (tag, pathToDir?) =>
    spawn(pathToDir, 'git', 'push', '--delete', 'origin', tag)

export const removeLocalTag = (tag, pathToDir?) =>
    spawn(pathToDir, 'git', 'tag', '--delete', tag)

export const gitTag = (tag, pathToDir?) =>
    spawn(pathToDir, 'git', 'tag', tag)

export const pushTag = (tag, pathToDir?) =>
    spawn(pathToDir, 'git', 'push', 'origin', tag)

export const gitPull = (pathToDir?) =>
    spawn(pathToDir, 'git', 'pull')

export const gitClone = (url, pathToDir?) =>
    spawn(pathToDir, 'git', 'clone', url)

export const gitCheckout = (str, pathToDir?) =>
    spawn(pathToDir, 'git', 'checkout', str)