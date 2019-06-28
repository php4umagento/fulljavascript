const path = require('path');
const axios = require('axios');
const WeTransfer = require('@wetransfer/js-sdk');
const Mailgun = require('mailgun-js');
const debug = require('debug')('server:send-artifacts');

/**
 * Get email from Stripe's `payment_intent.succeeded` webbook event
 * @param {*} event
 */
function getEmail(event) {
  return event.data.object.charges.data.map(d => d.billing_details.email)[0];
}

async function getArtifactsUrls(regex) {
  const repoName = 'dsa.js-data-structures-algorithms-javascript';
  // get all the last builds
  const buildsUrl = `https://circleci.com/api/v1.1/project/github/amejiarosario/${repoName}`;
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
  const downloadFilesPromises = filesUri.map((uri) => {
    return axios.get(uri, { responseType: 'arraybuffer' }).then((response) => {

      const name = path.basename(response.config.url);
      const content = Buffer.from(response.data);
      const size = content.length;

      return { name, content, size };
    });
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
    message: 'Data Structures and Algorithms in JavaScript',
    files,
  });
  return transfer.url;
}

async function sendEmailWithLink(email, link) {
  const mailgun = Mailgun({
    apiKey: process.env.MAILGUN,
    domain: process.env.MAILGUN_DOMAIN,
  });

  const text = `Data Structures & Algorithms in JavaScript

  Your book is ready!

  Thanks for buying the DSA.js book. You can download the book in the following link:
  ${link}
  `;

  const msg = {
    from: 'Adrian from DSA.js <dsa.js@mg.adrianmejia.com>',
    to: email,
    bcc: 'adriansky@gmail.com',
    subject: 'You bought Data Structures and Algorithms in JavaScript!',
    template: 'download-link-dsajs-book',
    text,
    'h:X-Mailgun-Variables': JSON.stringify({
      link,
    }),
  };

  return new Promise((resolve) => {
    mailgun.messages().send(msg, (error, body) => {
      if (error) throw error;
      debug('%o', body);
      resolve(body);
    });
  });
}

async function sendArtifacts(event) {
  const email = getEmail(event);
  debug(`customer email ${email}`);

  const urls = await getArtifactsUrls(/dsajs.*-v.*\.(epub|mobi|pdf)/i);
  const files = await downloadFiles(urls);
  const downloadLink = await uploadFilesToWetransfer(files);
  const sendPromise = await sendEmailWithLink(email, downloadLink);
  return sendPromise;
}

module.exports = {
  sendArtifacts,
  // "privates"
  getEmail,
  getArtifactsUrls,
  downloadFiles,
};


//
// Test
//

// const event = {
//   data: {
//     object: {
//       charges: {
//         data: [{
//           amount: 940,
//           billing_details: {
//             email: 'adriansky@gmail.com',
//             name: 'John Doe',
//           },
//           currency: 'usd',
//           paid: true,
//           payment_method_details: {
//             card: {
//               brand: 'visa',
//               country: 'US',
//               description: 'Visa Classic',
//               exp_month: 4,
//               exp_year: 2042,
//               last4: '4242',
//             },
//             type: 'card',
//           },

//         },
//         ],
//       },
//     },
//   },
//   type: 'payment_intent.succeeded',
// };

// sendArtifacts(event).then(u => console.log(u));
