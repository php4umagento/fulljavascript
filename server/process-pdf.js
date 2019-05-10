const axios = require('axios');

const url = 'https://circleci.com/api/v1.1/project/github/amejiarosario/dsa.js/latest/artifacts?filter=successful&branch=master';

async function getLatestPdf() {
  return axios.get(url).then((response) => {
    const { data } = response;
    const artifactsUrls = data.map(d => d.url);
    const bookUrl = artifactsUrls.filter(d => /dsajs-algorithms-javascript-book-v/i.test(d));
    return bookUrl[0];
  });
}

async function stampedPdfWithBuyerData(pdf, event) {
  // console.log(pdf, event);
  return 'not implemented';
}

async function sendEmail(stampedPdf, event) {
  // console.log(stampedPdf, event);
  return 'not implemented';
}

async function sendPdfToBuyer(event) {
  const pdfUrl = await getLatestPdf();
  const stampedPdf = await stampedPdfWithBuyerData(pdfUrl, event);
  await sendEmail(stampedPdf, event);
}

module.exports = {
  sendPdfToBuyer,
};

sendPdfToBuyer();
