# hexin :package: [![Linux Build status][travis-badge]][travis-link] [![Windows Build status][appveyor-badge]][appveyor-link]

hexin (Héxīn, 核心, core in chinese) is a cli that helps you to use monorepos as private/public container of modules.

The idea comes when appears the need to have all our Frontend dependencies libraries under control, we found that the best way is using a monorepo, like lerna or a custom system, also we started to use monorepos in our projects because in that way we control better the dependencies and we can split in modules our flow and projects. In addition we started to use Typescript everywhere we can, and we need also to find a way to include that Typescript without compiling it, so in that context hexin born.

## Prerequisites

- NodeJS >= 4.0
- Yarn >= 1.0.0
- Git

## Needs

- Have all our UI dependencies in a repository (monorepo)
    - This provides us control over all packages
    - This force us to use same development flow over all tools
- Have that packages secured under private git repository
- Have defined our deps in a file, and understand how dependencies are ours
- Typescript packages not need to be compiled

## What hexin does

The idea is simple, is like a nodejs package manager that takes the packages from a git repository.

- You should have 2 monorepos:
    - One monorepo for the 'hexin packages'
    - Second monorepo for your project

- We recommend you, to use this both starters, to test how works the tool:
    - For the 'hexin packages' repository: [https://github.com/bpmsoasolutions/hexin-modules-test](https://github.com/bpmsoasolutions/hexin-modules-test)
    - For the app repository: [https://github.com/bpmsoasolutions/hexin-project-test](https://github.com/bpmsoasolutions/hexin-project-test)
    - Both projects are based on this started: [https://github.com/Quramy/lerna-yarn-workspaces-example](https://github.com/Quramy/lerna-yarn-workspaces-example)

### For develop the packages

- In your 'hexin packages' monorepo create your nodejs packages that then can be shared between your projects
- Once you finished a packages, to mark as an 'hexin package' use `hex release` command:
    - This put a '<name>@<version>' as a git tag
    - Push the tag to your 'hexin packages' monorepo
- Congrats now you have your packages 'published'

### For develop the app

- In the destination repository (the project of your app), run `hex append url_of_your_git_monorepo`, this download the repository in the hexin cache folder
- To add an 'hexin-package' to the destination repository use:
    - `hex add name@version` or `hex add name`
    - this make this modifications in the package.json (this is an example from our test repository):
    ```
    "hexDependencies": {
        "https://github.com/bpmsoasolutions/hexin-modules-test.git": {
            "@bss/utils": "1.0.0"
        }
    }
    ```
- Also it copy the directory of that module from the cache of your 'hexin packages' monorepo, to the destination monorepo as a package.
- Then run `hex bootstrap` this run yarn and lerna and then remove the hexin packages from the package.json, in this way you can normally work and add packages with yarn.

Note that after every yarn operation such add or remove you should always run `hex bootstrap`

## Commands

- **add <name>**: Adds a 'hexin package' previously downloaded from the hexin cache to the monorepo destination, and then run `hex bootstrap` to link all deps between. It supports:
    - `hex add <name>`
    - `hex add [<@scope>/]<name>`
    - `add [<@scope>/]<name>@<version>`

- **append <git_url_repo>**:  Download a monorepo to .hexin cache

- **bootstrap**: Copy neccesary repos wrote on package.json (download to cache if necessary), adds as dependency in package.json and then runs yarn and lerna bootstrap and at last removes packages from package.json

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
[appveyor-badge]: https://img.shields.io/appveyor/ci/bss-ruben-fernandez/hexin.svg?style=flat-square&label=windows
[appveyor-link]: https://ci.appveyor.com/project/bss-ruben-fernandez/hexin