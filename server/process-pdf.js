// DEBUG='server:process-pdf' nodemon process-pdf.js

const axios = require('axios');
const HummusRecipe = require('hummus-recipe');
const Mailgun = require('mailgun-js');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('server:process-pdf');

const repoName = 'dsa.js-data-structures-and-algorithms-in-javascript';


// get all the last builds
const buildsUrl = `https://circleci.com/api/v1.1/project/github/amejiarosario/${repoName}`;
const assetsUrl = `${buildsUrl}/latest/artifacts?filter=successful&branch=master`;
const assetFileName = d => /dsajs-algorithms-javascript-book-v/i.test(d);

const mailgun = Mailgun({
  apiKey: process.env.MAILGUN,
  domain: process.env.MAILGUN_DOMAIN,
});

async function getLatestPdfUrl() {
  // depending on the job (docs or build) order it might get the wrong one
  // const response = await axios.get(assetsUrl);

  // get all builds
  const BuildsResponse = await axios.get(buildsUrl);

  // find last successful master doc
  const build = BuildsResponse.data.find(b => b.build_parameters.CIRCLE_JOB === 'docs' &&
      b.branch === 'master' &&
      b.status === 'success');

  const buildNumber = build.build_num;

  const response = await axios.get(`${buildsUrl}/${buildNumber}/artifacts`);
  const artifactsUrls = response.data.map(d => d.url);
  const bookUrl = artifactsUrls.filter(assetFileName)[0];
  return bookUrl;
}

async function downloadPdf(url) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  return Buffer.from(response.data);
}

/*
 * Adds watermark on page 1 and half book
 */
function modifyPdf(input, output, logoPath, email) {
  const opacity = 0.4;
  const color = '#919191';

  const pdfDoc = new HummusRecipe(input, output);
  const { metadata } = pdfDoc;
  const pages = Object.keys(metadata).length;
  const middle = Math.ceil(pages / 2);
  const { width, height } = metadata['1'];

  const x = width - 170;
  const y = 30;
  const x1 = 20;
  const y1 = height - 70;

  debug('PDF details %o', {
    pages, middle, width, height,
  });

  pdfDoc
    // edit 1st page
    .editPage(1)
    // .text('Add some texts to an existing pdf file', 150, 300)
    // .rectangle(20, 20, 40, 100)
    // .comment('Add 1st comment annotaion', 200, 300)
    .image(logoPath, x, y, {
      align: 'left center',
      width: 30,
      keepAspectRatio: true,
      opacity: opacity - 0.1,
      // link: 'https://adrianmejia.com', // not implemented: https://github.com/chunyenHuang/hummusRecipe/issues/37
    })
    .text('Sold to', x, y + 35, {
      bold: true,
      align: 'left center',
      color,
      opacity: opacity + 0.2,
    })
    .text(email, x, y + 50, {
      align: 'left center',
      color,
      opacity: opacity + 0.2,
    })
    .endPage()

    // middle page
    .editPage(middle)
    .text('Sold to', x1, y1 + 50, {
      bold: true,
      align: 'left center',
      color,
      opacity,
    })
    .text(email, x1, y1 + 65, {
      align: 'left center',
      color,
      opacity,
    })
    .endPage()

    // end and save
    .endPDF();
}

function filePathToBuffer(path) {
  return new Promise((resolve) => {
    fs.readFile(path, (error, data) => {
      if (error) throw error;
      resolve(data);
    });
  });
}

async function stampedPdfWithBuyerData({ pdfBuffer, email, fileName }) {
  const outputPath = `tmp/${fileName}`;
  const logoPath = 'assets/logo.png';

  await fs.promises.mkdir('tmp', { recursive: true });
  modifyPdf(pdfBuffer, outputPath, logoPath, email);

  return outputPath;
}

async function sendEmail({ stampedPdfPath, email }) {
  const filepath1 = path.join(__dirname, stampedPdfPath);

  const data = {
    from: 'DSA.js eBook <dsa.js@mg.adrianmejia.com>',
    // to: 'Adrian Mejia <adriansky@gmail.com>, admejiar@cisco.com, adrianmejia86do@yahoo.com',
    to: email,
    bcc: 'adriansky@gmail.com',
    subject: 'You bought Data Structures and Algorithms in JavaScript!',
    template: 'titlebody', // https://designmodo.com/postcards/app/
    'h:X-Mailgun-Variables': JSON.stringify({
      title: 'DSA.js Book',
      body: 'Thanks for buying the Data Structure and Algorithms book. You can find it attached to this email.',
      preheader: 'Here is your ebook',
    }),
    attachment: [filepath1],
  };

  return new Promise((resolve) => {
    mailgun.messages().send(data, (error, body) => {
      if (error) throw error;
      debug('%o', body);
      resolve(body);
    });
  });
}

async function sendPdfToBuyer(event) {
  const email = event.data.object.charges.data.map(d => d.billing_details.email);
  debug(`sendPdfToBuyer ${email}`);

  debug('Getting latest PDF url...');
  const pdfUrl = await getLatestPdfUrl();
  const fileName = pdfUrl.split('/').pop();

  debug(`Downloading pdf from URL ${pdfUrl}...`);
  // const pdfUrl = 'https://56-77558427-gh.circle-artifacts.com/0/book/dsajs-algorithms-javascript-book-v1.2.2.pdf';
  const pdfBuffer = await downloadPdf(pdfUrl);

  debug(`Stamping PDF size ${pdfBuffer.length}...`);
  const stampedPdfPath = await stampedPdfWithBuyerData({ pdfBuffer, email, fileName });

  debug(`Sending email to ${email}`);
  await sendEmail({ stampedPdfPath, email, fileName });
}

module.exports = {
  sendPdfToBuyer,
};

//
// Test
//

// getLatestPdfUrl().then(u => console.log(u));

// sendPdfToBuyer({
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
// });
