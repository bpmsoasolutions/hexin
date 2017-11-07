/*
[ 'yarn run v1.3.2',
  '$ /Users/dbr/.hexin/cache/bss-frontend-libs/node_modules/.bin/lerna ls --json',
  'lerna info version 2.5.1',
  'YOUR REAL OUTPUT'
  'Done in 0.46s.',
  '' ]
*/

export const cleanFromYarnCMD = (string) =>
    string.split('\n').slice(3).reverse().slice(2).reverse().join(' ')