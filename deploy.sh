#!/usr/bin/env sh

set -e
npm run docs:build
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:vue-yandex-maps/vue-yandex-maps.github.io.git master

cd -