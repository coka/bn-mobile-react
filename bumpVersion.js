/* eslint-disable func-names */
module.exports.increment = function(level = 'patch') {
  const fs = require('fs');
  const app = require('./app.json');
  const version = app.expo.version.split('.')
  const android = app.expo.android.versionCode

  switch (level) {
  case 'major':
    version[0] = parseInt(version[0], 10) + 1
    break;
  case 'minor':
    version[1] = parseInt(version[1], 10) + 1
    break;
  default:
    version[2] = parseInt(version[2], 10) + 1
    break;
  }

  app.expo.version = version.join('.')
  app.expo.android.versionCode = `${parseInt(android, 10) + 1}`
  fs.writeFile('app.json', JSON.stringify(app), (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
};