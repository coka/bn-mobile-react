#!/usr/bin/env bash
set -e # exit entire script when command exits with non-zero status

#If the last commit was a version bump, don't bump again

LAST_COMMIT=`git log -1 --pretty=%B`
echo "Checking if last commit was a version bump"
if [[ ${LAST_COMMIT} == *"Travis build:"* ]]; then
    #The last commit was a build, do not run again, but it is not a failure
    echo "${LAST_COMMIT} was an increment, do not increment again"
    exit 0
else
    echo "Changes found, continuing with the version bump"
fi



git config --global user.email "travis@travis-ci.org"

git config --global user.name "Travis CI"

git remote add origin-ci https://${GH_USER}:${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git > /dev/null 2>&1

node -e 'require("./bumpVersion.js").increment();'

git add app.json

git commit --message "Increment version numbers in app.json. Travis build: $TRAVIS_BUILD_NUMBER [ci skip]"

git push origin-ci HEAD:$TRAVIS_BRANCH
