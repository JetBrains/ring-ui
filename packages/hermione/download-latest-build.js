/* eslint-disable no-shadow,no-console */
const {execSync} = require('child_process');
const path = require('path');
const {promisify} = require('util');

const axios = require('axios');
const yauzl = require('yauzl');
const fs = require('fs-extra');

require('dotenv').config();

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const teamCityClient = axios.create({
  baseURL: 'https://teamcity.jetbrains.com/app/rest/',
  headers: {
    Authorization: `Bearer ${process.env.TEAMCITY_TOKEN}`
  }
});

const fromBuffer = promisify(yauzl.fromBuffer);

function unzip(buffer) {
  const resolvers = [];
  const zipfilePromise = (async () => {
    const zipfile = await fromBuffer(buffer, {lazyEntries: true});
    zipfile.on('entry', entry => {
      const resolver = resolvers.shift();
      if (resolver != null) {
        resolver({
          value: {
            entry,
            openReadStream: promisify(
              zipfile.openReadStream.bind(zipfile, entry)
            )
          },
          done: false
        });
      }
    });
    zipfile.once('end', () =>
      resolvers.forEach(resolver => resolver({done: true})));
    return zipfile;
  })();

  return {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          const result = new Promise(resolve => resolvers.push(resolve));
          const zipfile = await zipfilePromise;
          zipfile.readEntry();
          return result;
        }
      };
    }
  };
}

async function ensureWriteStream(path) {
  await fs.ensureFile(path);
  return fs.createWriteStream(path);
}

async function downloadArtifacts(buildLocator, src, dest) {
  try {
    console.log(`Downloading ${src}`);
    const {data} = await teamCityClient.get(`builds/${buildLocator}/artifacts/content/${src}`, {
      responseType: 'arraybuffer'
    });
    console.log(`Unzipping ${src}`);
    for await (const {entry, openReadStream} of unzip(data)) {
      // skip directory entries
      if (/\/$/.test(entry.fileName)) {
        continue;
      }
      const [readStream, writeStream] = await Promise.all([
        openReadStream(),
        ensureWriteStream(path.join(dest, entry.fileName))
      ]);
      const endPromise = new Promise(resolve =>
        readStream.once('end', resolve));
      readStream.pipe(writeStream);
      await endPromise;
    }
    console.log(`Unzipped ${src}`);
  } catch (e) {
    console.error(e.message);
  }
}

downloadArtifacts(
  `branch:${branch},buildType:(id:JetBrainsUi_RingUi_GeminiTests)`,
  'html-report.zip',
  'html-report',
);
