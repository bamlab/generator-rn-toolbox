const http = require('http');
const compareVersion = require('compare-version');
const packageSettings = require('../../package.json');

function fetchVersion() {
  return new Promise((resolve, reject) => {
    http.get(
      {
        host: 'registry.npmjs.org',
        path: '/generator-rn-toolbox',
      },
      response => {
        // Continuously update stream with data
        let body = '';

        response.on('error', reject);

        response.on('data', d => {
          body += d;
        });

        response.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(new Error('ERROR_ON_FETCH'));
          }
        });
      }
    );
  });
}

function getVersion() {
  return fetchVersion().then(res => res['dist-tags'].latest);
}

function isPackageUpdated() {
  return getVersion().then(
    latestVersion => compareVersion(packageSettings.version, latestVersion) >= 0
  );
}

module.exports = isPackageUpdated;
