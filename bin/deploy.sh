#! /usr/bin/env bash
set -e # exit entire script when command exits with non-zero status

usage() {
  cat <<HELP_USAGE

    HELP

    Deploys mobile applications using expo to the play store
    and the app stores.

    $ ./deploy.sh environment

    environment: Either "prod-v1" or "staging-v1"

    Required environment variables:
    APP_IDENTIFIER: App identifier (com.bigneon.mobile)
    SENTRY_AUTH_TOKEN: The auth token for sentry
    EXPO_USERNAME: The Big Neon Expo username
    EXPO_PASSWORD: The Big Neon Expo password
    DELIVER_USERNAME: Your Apple developer username
    DELIVER_PASSWORD: Your Apple developer password
    FASTLANE_ITC_TEAM_ID: The Big Neon Itunes connect Team ID (119447135)

    Optional environment variables:
    PLATFORM: Only deploy to one platform (android,ios,all) [all]
    Requirements
HELP_USAGE
}

if [ -f "./.creds/local_source.sh" ]; then
  source "./.creds/local_source.sh"
  SKIP_NPM_INSTALL=1
fi

if [ "$#" -lt 1 ]; then
  usage
  exit 1
fi

if [ -z "$PLATFORM" ]; then
  PLATFORM="all"
fi
if [ -z "$APP_IDENTIFIER" ] || [ -z "$SENTRY_AUTH_TOKEN" ] || [ -z "$EXPO_USERNAME" ] || [ -z "$EXPO_PASSWORD" ] || [ -z "$DELIVER_USERNAME" ] || [ -z "$DELIVER_PASSWORD" ] || [ -z "$FASTLANE_ITC_TEAM_ID" ]; then
  echo 'ERROR: Missing required environment variable'
  usage
  exit 1
fi

function write_visual_bells() {
  while true; do
    echo -en "\a"
    sleep 10
  done
}

write_visual_bells &

# Environment should be "production" or "staging"
ENVIRONMENT=$1

#The track is used to tell fastlane where to place the android release
TRACK=$([[ "$ENVIRONMENT" == prod* ]] && echo "beta" || echo "alpha")

# inject sentry auth token into app.json
echo "Injecting SENTRY_AUTH_TOKEN into app.json"
sed -i .bak "s/__SECRET_SENTRY_AUTH_TOKEN__/$SENTRY_AUTH_TOKEN/g" app.json

# Install dependencies
if [ -z "$SKIP_NPM_INSTALL" ]; then
  echo "Installing dependencies"
  npm ci
else
  echo "Skipping npm install because we are running locally"
fi

echo "Logging into Expo as Big Neon"
npx expo login -u "$EXPO_USERNAME" -p "$EXPO_PASSWORD"

echo "Publishing release to $ENVIRONMENT channel"
npx expo publish --release-channel "$ENVIRONMENT" --non-interactive

if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "ios" ]; then
  echo "Starting standalone iOS build on $ENVIRONMENT channel"
  npx expo build:ios --release-channel "$ENVIRONMENT" --non-interactive --no-publish

  # Download the artifact to current directory as `app.ipa`
  echo "Downloading iOS ipa"
  curl -o app.ipa "$(npx expo url:ipa --non-interactive)"

  # Use fastlane to upload your current standalone iOS build to test flight on iTunes Connect.
  echo "Publishing to iTunes Connect"
  fastlane deliver --verbose --ipa "app.ipa" --skip_screenshots --skip_metadata --username "$DELIVER_USERNAME"
else
  echo "Skipping ios, only deploying for $PLATFORM"
fi

if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "android" ]; then
  echo "Starting standalone android build on $ENVIRONMENT channel"
  npx expo build:android --release-channel "$ENVIRONMENT" --non-interactive --no-publish

  # Download the built android binary
  echo "Downloading android apk"
  curl -o app.apk "$(npx expo url:apk --non-interactive)"

  # Ask Keith for the JSON key. Store this one directory below the app, and DO NOT ADD TO GIT
  echo "Publishing apk to $TRACK track in Google Play Store"
  fastlane supply --track "$TRACK" --json_key './.creds/google-deploy-key.json' --package_name "com.bigneon.mobile" --apk "app.apk" --skip_upload_metadata --skip_upload_images --skip_upload_screenshots
else
  echo "Skipping android, only deploying for $PLATFORM"
fi

echo "$ENVIRONMENT deploy completed"
exit 0
