# bn-mobile-react
BigNeon React Native Repo

This is the react native Big Neon Mobile App repository, part of the Big Neon ticketing system.

# Overall project architecture

Big Neon is a multi-tiered micro-services architecture for selling and managing tickets. The software system is made up
of multiple components. As such, the code is split across multiple repositories. To get an overall picture of how
everything fits together have a look at the [docs repository]( https://github.com/big-neon/docs.git)

## Project Setup

* If you don't use the `asdf` version manager, set it up: https://github.com/asdf-vm/asdf
* Run `./bin/setup` from the project directory.
* Run `./bin/start` to start the app on your dev machine.

### Tech Stack
#### Explanation
This will be a React Native app for iOS and Android.

#### React Native Standalone Debugger
To use the RN Standalone Debugger with an iPhone simulator, first install it with:

```
brew update && brew cask install react-native-debugger
```

Then, make sure You disable Remote Debugging on any running simulators.  (`Cmd+D -> Disable Remote JS Debugging`)

Then run `npm run debug`

After the standalone debugger loads up, you can then re-enable Remote JS Debugging, which should then open in the standalone app, and not in a browser window.

### Requirements

### Mobile
React Native (https://facebook.github.io/react-native/)

Unstated (https://github.com/jamiebuilds/unstated)

React Navigation (https://reactnavigation.org/)

### Deploying

There are staging and production deploy scripts, based on using Expo's release channels. These will build the apps with the appropriate staging or production config settings.

You will need Apple and Google developer accounts.

We're using [Expo Build releasing through Fastlane](https://blog.expo.io/automating-standalone-expo-app-builds-and-deployments-with-fastlane-exp-and-exptool-9b2f5ad0a2cd) as a guideline if you want to try to set up your own deploy.

#### Set up your environment for deployment

In your `.bash_profile` (or whichever file hosts your bash/zsh/etc config),
2
```
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export DELIVER_USERNAME=apple developer username
export DELIVER_PASSWORD=apple developer password
export FASTLANE_ITC_TEAM_ID=119447135
```
The Team ID is the Big Neon Team ID in the App Store. To deploy, you will need to be added to the organization.

[Based on the steps here](https://docs.expo.io/versions/latest/guides/building-standalone-apps.html#3-start-the-build), first you need to set up some keystores:

*Android:*

```
$> expo build:android
```

In the following text, select `2) I want to upload my own keystore!`
```
Would you like to upload a keystore or have us generate one for you?
If you don't know what this means, let us handle it! :)

  1) Let Expo handle the process!
  2) I want to upload my own keystore!
```

You can get the keystore file from @krakaw or @daybreaker on Big Neon Dev IRC, as well as the `keystpre password`, `key alias`, and `key password`, which will all be needed.

*iOS:*

```
$> expo build:ios
```

In the following text, select `I will provide all the credentials and files needed, Expo does no validation`
```
[exp] Making sure project is set up correctly...
[exp] Your project looks good!
[exp] Checking if current build exists...

[exp] No currently active or previous builds for this project.
? How would you like to upload your credentials?
 (Use arrow keys)
❯ Expo handles all credentials, you can still provide overrides
  I will provide all the credentials and files needed, Expo does no validation
```

You can get the relevant mobile provision and p12 files listed below from @krakaw or @daybreaker on Big Neon Dev IRC, as well as the `Distribution p12 password` and `Push p12 password`

```
big-neon-mobile.mobileprovision
big-neon-mobile_dist.p12
big-neon-mobile_dist_cert_private.key
big-neon-mobile_push.p12
big-neon-mobile_push_cert_private.key
```

To install Fastlane, make sure you have ruby and bundler installed first. Then install the fastlane gem.

```
$> bundle update
```

You will also need a `google-deploy-key.json` file to upload to Google. Contact @krakaw or @daybreaker on Big Neon Dev IRC for this file, and save it in the .creds directory. Never commit it to github.

#### Deploying

First, make sure you bump the `version` and `android:versionCode` numbers in `app.json`.

- `version` should follow semantic versioning: `major.minor.patch`. If the updates are minor, just bump the patch number by one. Moderate changes bump the minor number by 1. And large changes bump the major number by 1.
- `versionNumber` must always be an integer, and can just be incremented by one.

```
$> ./deploy_staging
```

This will build the app with the staging variables, and deploy to the Google Play store's alpha track, and to Apple's App Store Connect.

In the Apple App Store Connect, you may need to manually go to the build listing and fix the Missing Compliance issue.

Also, make sure there is always a `user: test@example.com, pass: test` account so Apple can log in to the app to test it.

