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

VERSION_LEVEL=$([[ "$TRAVIS_BRANCH" == "master" ]] && echo "minor" || echo "patch")

node -e "require(\"./bumpVersion.js\").increment(\"$VERSION_LEVEL\");"

git add app.json

NEW_VERSION=$(node -e 'process.stdout.write(require("./app.json").expo.version);')

git commit --message "Increment version numbers in app.json [$NEW_VERSION]. Travis build: $TRAVIS_BUILD_NUMBER [ci skip]"

git tag -a "$NEW_VERSION" -m "$NEW_VERSION"
git push origin-ci --tags
git push origin-ci HEAD:$TRAVIS_BRANCH
