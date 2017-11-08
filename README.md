# hexin :package: [![Linux Build status][travis-badge]][travis-link]

hexin (Héxīn, 核心, core in chinese) is a cli that helps you to use monorepos as private/public container of modules.

The idea comes when appears the need to have all our Frontend dependencies libraries under control, we found that the best way is using a monorepo, like lerna or a custom system, also we started to use monorepos in our projects because in that way we control better the dependencies and we can modularize our flow and projects. In addition we started to use Typescript everywhere we can, and we need also to find a way to include that Typescript without compiling it, so in that context hexin borns.
The idea is simple:

- You have 2 monorepos: One monorepo for the 'hexin packages' and the other for your project.
- Both monorepos is better to be like this example [https://github.com/Quramy/lerna-yarn-workspaces-example](https://github.com/Quramy/lerna-yarn-workspaces-example), with that you can have the yarn workspaces, lerna for linkin the packages internally, and the best part, you dont need to compile your typescript packages
- In your 'hexin packages' monorepo define nodejs packages as you do normally
- To mark as an hexin-packages use `hex release` command, this put a 'name@version' git tag and push the tag to your repo, or if the packages are public, you can use `lerna publish`
- Congrats now you have your packages 'published'
- In the destination repository, runs `hex append url_of_your_git_monorepo` this downloads the repository
- To add an 'hexin-package' to the destination repository use `hex add name@version` or `hex add name`, this make this modifications in the package.json (this is an example from our test repository):
    ```
    ...
    "dependencies":{
        ...
        "@bss/utils": "1.0.0"
        ...
    },
    "hexDependencies": {
        "https://github.com/bpmsoasolutions/hexin-modules-test.git": {
            "@bss/utils": "1.0.0"
        }
    }
    ```
- Also it copy the directory of that module from the cache of your 'hexin packages' monorepo, to the destination monorepo as a package.
- Then run `hex bootstrap` this run yarn and lerna and then remove the hexin packages from the package.json, in this way you can normally work and add packages with yarn. Note that after every yarn operation such add or remove you should alaways run `hex bootstrap`

## Commands

- **add <name>**: Adds a 'hexin package' previusly downloaded from the hexin cache to the monorepo destination, and then run `hex bootstrap` to link all deps between. It supports:
    - `hex add <name>`
    - `hex add [<@scope>/]<name>`
    - `add [<@scope>/]<name>@<version>`

- **append <git_url_repo>**:  Download a monorepo to .hexin cache

- **bootstrap**: Copy neccesary repos wrote on package.json (download to cache if neccesary), adds as dependency in package.json and then runs yarn and lerna bootstrap and at last removes packages from package.json

- **release <env> [type]**: Tag a new version of the selected package, and push the tag

- **unrelease**: ask to remove a git tag from the git tags list, this remove from hexin that package

- **clean**: Remove hexin folders and clean package.json from 'hexin' stuff

## Todo

- `hexin upgrade` to upgrade `hexin packages` to new versions
- Wrap yarn commands to always rerun `hex bootstrap` after instalation
- Make work `hexin packages` that are childs of other `hexin packages`
- Resolve better lerna configuration, now packages folder are fixed and only work with 'packages' folder
- Test test test

## We are working in progress

[travis-badge]: https://img.shields.io/travis/bpmsoasolutions/hexin.svg?style=flat-square&label=linux
[travis-link]: https://travis-ci.org/bpmsoasolutions/hexin