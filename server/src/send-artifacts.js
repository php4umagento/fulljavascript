const axios = require('axios');
const WeTransfer = require('@wetransfer/js-sdk');
const debug = require('debug')('server:send-artifacts');

/**
 * Get email from Stripe's `payment_intent.succeeded` webbook event
 * @param {*} event
 */
function getEmail(event) {
  return event.data.object.charges.data.map(d => d.billing_details.email)[0];
}

async function getArtifactsUrls(regex) {
  const repoName = 'dsa.js-data-structures-and-algorithms-in-javascript';
  // get all the last builds
  const buildsUrl = `https://circleci.com/api/v1.1/project/github/amejiarosario/${repoName}`;
  const assetsUrl = `${buildsUrl}/latest/artifacts?filter=successful&branch=master`;
  const pattern = str => regex.test(str);

  const buildsResponse = await axios.get(buildsUrl);

  // find last successful master doc
  const build = buildsResponse.data.find(b => b.build_parameters.CIRCLE_JOB === 'docs' &&
      b.branch === 'master' &&
      b.status === 'success');

  const buildNumber = build.build_num;
  const response = await axios.get(`${buildsUrl}/${buildNumber}/artifacts`);
  const artifactsUrls = response.data.map(d => d.url);
  return artifactsUrls.filter(pattern);
}

async function downloadFiles(filesUri) {
  const downloadFilesPromises = filesUri.map(uri => axios({
    uri,
    method: 'GET',
    responseType: 'arraybuffer',
  })).then((response) => {
    const content = Buffer.from(response.data);
    const size = content.length;
    const name = response;

    return { name, content, size };
  });

  return Promise.all(downloadFilesPromises);
}

/**
 * Upload files to WeTransfer and get link
 * @param {Object[]} files array of files with the shape {name, size, content}
 * @returns {String} url
 */
async function uploadFilesToWetransfer(files) {
  const wtClient = await WeTransfer(process.env.WETRANSFER);
  const transfer = await wtClient.transfer.create({
    message: 'Data Structures and Algorithms in JavaScript!',
    files,
  });
  return transfer.url;
}

async function sendArtifacts(event) {
  const email = getEmail(event);
  debug(`customer email ${email}`);

  const urls = await getArtifactsUrls(/dsajs.*-v.*\.(epub|mobi|pdf)/i);
  const files = await downloadFiles(urls);
  const downloadLink = await uploadFilesToWetransfer(files);
}

module.exports = {
  sendArtifacts,
  // "privates"
  getEmail,
  getArtifactsUrls,
  downloadFiles,
  uploadFilesToWetransfer,
};
