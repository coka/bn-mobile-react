|            | Build Status                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Staging    | [![Build Status](https://travis-ci.com/revelrylabs/uniti.svg?token=JiDUwgto8S7TTehG43yL&branch=develop)](https://travis-ci.com/revelrylabs/uniti) |
| Production | [![Build Status](https://travis-ci.com/revelrylabs/uniti.svg?token=JiDUwgto8S7TTehG43yL&branch=develop)](https://travis-ci.com/revelrylabs/uniti) |

**Note:** _The CI badge links in markdown format are located in each TravisCI project by just clicking on the Badge next to the project name_

# Big Neon

Product Owner:

- **Project Start Date:** 8/6/18

## Links to relevant docs, repos, etc.

| Thing                  | Location                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Waffle Board           | [link](https://waffle.io/revelrylabs/bn-mobile-react)                                |
| Google Drive           | [link](https://drive.google.com/drive/u/0/folders/15teu8YZtjJ06aLGGt8b1UBmEDS_O_-k0) |
| Sprint Reports         | [link](https://drive.google.com/drive/u/0/folders/1z5Qp0Z95lNAK0agxKyAIb_uqpvI-JTtW) |
| Continuous Integration | [TBD]()                                                                              |
| Style Guide            | [TBD]()                                                                              |
| iOS App Store          | [TBD]()                                                                              |
| Google Play Store      | [TBD]()                                                                              |

## Compatibility Targets

Big Neon is a React Native App that will be built for the latest iOS and Android versions.

### Native App OS Compatibility Targets

| Platform | OS Version             | Install Base                                              |
| -------- | ---------------------- | --------------------------------------------------------- |
| iOS      | 10 and above           | https://developer.apple.com/support/app-store/            |
| Android  | 4.4 (KitKat) and above | https://developer.android.com/about/dashboards/index.html |

### Native App Device Compatibility Targets

| Platform | Devices                         |
| -------- | ------------------------------- |
| iOS      | iPhone 6 and newer              |
| Android  | Samsung S6, S7, and S8 families |

## The Project Brief

This is a Fork of the original Big Neon [repository](https://github.com/big-neon/bn-mobile-react). Revelry is participating in an open source contribution for Big Neon.
We will be working from this forked repository and submitting Pull Requests back to the original repo. There are several components to the Big Neon project and those can be seen [here](https://github.com/big-neon). Essentially this will be a Mobile App that connects with an API and DB housed in seperate repositories.

From the original Big Neon repo:

> Big Neon is a multi-tiered micro-services architecture for selling and managing tickets. The software system is made up
> of multiple components. As such, the code is split across multiple repositories. To get an overall picture of how
> everything fits together have a look at the [docs repository](https://github.com/big-neon/docs.git)

### The Idea

Big Neon is a Mobile App for event ticket exchange. Users can buy, sell and transfer tickets. This could be a platform for event goers as well as Sponsors distibuting tickets to their events. The main draw is that the tickets are solely digital assets and exchanged on top of Tari for secure digital asset transactions.

### Who are we building for?

**Event Attendees:** People interested in attending events and purchasing tickets to those events.

**Event Ticket Holders:** People interested in selling their tickets to events.

**Event Sponsor:** Venues, Promoters, etc that host events and make tickets available to purchase for those events

### What is the main problem we are trying to solve?

Big Neon is the piece for a ticket exchange, the fact that it is built on Tari solves The problem of “economic leakage,” where middlemen reap all the revenue from the resale of virtual goods. Tari will be designed to help compensate original “owners,” like artists, sports teams, event promoters, and other parties.

### What is the core loop?

**Event Attendees:** Browse/Search for events they want to attend and purchase tickets to those events.

**Event Tickets Holders:** Transfer or Sell their own tickets to interested attendees.

**Event Sponsor:** List tickets for sale to events that they sponsor.

## Nouns & Verbs

### Nouns

**Tari:** Tari is a new open source, digital assets focused blockchain protocol that is being architected as a merge-mined sidechain with Monero. We chose to focus specifically on digital assets – things like tickets, loyalty points, in-game items, and crypto-native assets like CryptoKitties – because we see a huge opportunity to revolutionize the way these assets are owned, managed and transferred.

**Digital Asset:** A digital asset is one that consumers can purchase or earn the right to use, but which exists entirely in digital form. Digital assets include event tickets, in-game items, loyalty points, and cryptonative assets.

**Attendees:** Event goers looking to purchase tickets to events.

**Ticket Holders:** Users who have purchased or hold existing tickets and are looking to sell them to Attendees.

**Sponsors:** Venues, Artists, Sports Teams etc that list a specified number of tickets to events of their creation.

**Events:** Concerts, Sporting Events, or any event that is ticketed and sold to attendees.

**Current Location:** The location where the user is currently so events happening around them will show up in their feed.

### Verbs

**Transfer:** Users will be able to transfer their tickets to other users

**Buy:** Users can buy tickets rom Venues and other users.

**Sell:** Users or Sponsors can sell tickets to events.

**List:** Sponsors will be able to List an allotted number of tickets to their events.

**Explore:** Users can explore or browse events happening around them or in general via searching for other cities, venues artists etc.

**Search:** Users can search cities, venues, artists, sports teams etc.

**Trending:** Tickets in a users area that are selling quickly

## Team

| Role             | Person          | Email |
| ---------------- | --------------- | ----- |
| Client           | Tari            |
| Product Owner    |                 |
| PM               | Colin Scott     |
| Tech Lead        | Brad Huber      |
| Engineer         | Joel Wietelmann |
| Designer         | Brittany Gay    |
| QA               |                 |
| Business Analyst |                 |
| Account Manager  |                 |

## Project Setup

- If you don't use the `asdf` version manager, set it up: https://github.com/asdf-vm/asdf
- Run `./bin/setup` from the project directory.
- Run `./bin/start` to start the app on your dev machine.

### Tech Stack

#### Explanation

This will be a React Native app for iOS and Android.

#### React Native Standalone Debugger

To use the RN Standalone Debugger with an iPhone simulator, first install it with:

```
brew update && brew cask install react-native-debugger
```

Then, make sure You disable Remote Debugging on any running simulators. (`Cmd+D -> Disable Remote JS Debugging`)

Then run `npm run debug`

After the standalone debugger loads up, you can then re-enable Remote JS Debugging, which should then open in the standalone app, and not in a browser window.

### Requirements

### Mobile

React Native (https://facebook.github.io/react-native/)

Unstated (https://github.com/jamiebuilds/unstated)

React Navigation (https://reactnavigation.org/)

### Deploying

The deploy script will work deploying to Test Flight, and the Alpha or Beta channels in Google Play.

It requires several certificates and ENV keys set, many of which aren't shareable.

We're using [Expo Build releasing through Fastlane](https://blog.expo.io/automating-standalone-expo-app-builds-and-deployments-with-fastlane-exp-and-exptool-9b2f5ad0a2cd) if you want to try to set up your own deploy.

#### Deploy Steps

1. Get creds folder from Colin or Brad and place in `./creds` folder inside bn-mobile-react. This file is gitignored so it will not get pushed with any code.
2. run `expo build:android --clear-credentials` and choose "I want to upload my own keystore" (passwords etc will be shared via the creds folder)
3. Once step 2 succeeds run `expo build:ios --clear-credentials` again choose to use your own credentials.
4. Update `app.json` version numbers before running deploy. increment "version" and "versionCode" respectively.
5. To deploy and use the Beta endpoint for testers run `./deploy_staging`, for the production API endpoint use `./deploy_production`.
6. Apple may want you to make an App Specific password during the deploy. The instructions are ion the script and you will enter the pw you created without exiting the deploy process.
7. To prepare for Google Play store in the alpha track, go to manage release, and you can add release notes.
8. To prepare for App Store connect go to test flight, and go to iOS Builds. Find the newest version, and it’ll say “Missing Compliance”. click on the yellow triangle icon and then “provide export compliance information”, and then choose “Yes” for both questions. The build should show up in `Test Flight -> App Store Connect Users -> Builds` as “Testing” after a few minutes.
