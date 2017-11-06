import * as shell from 'shelljs'
import * as path from 'path'
import * as inquirer from 'inquirer'

import { getTags, removeRemoteTag, removeLocalTag, output, err } from '../helpers'

export const unrelease = async (CWD, env, type) => {

    let tags = await getTags(CWD)

    if (tags.length === 0 || !tags){
        throw 'Any tag found on this monorepo'
    }

    let answers = await inquirer
        .prompt([{
            type: 'list',
            name: 'tag',
            message: 'What version we have unrelease?',
            paginated: true,
            choices: tags
        },{
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure?`,
        }])

    if (answers.confirm) {
        try {
            await removeRemoteTag(answers.tag, CWD)
        } catch (error) {
            await removeLocalTag(answers.tag, CWD)
            throw error
        }

        await removeLocalTag(answers.tag, CWD)
    }
}
