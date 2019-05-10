const axios = require('axios');
const fs = require('fs');

const url = 'https://circleci.com/api/v1.1/project/github/amejiarosario/dsa.js/latest/artifacts?filter=successful&branch=master';

axios.get(url)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });

// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
async function downloadPdf(url) {
  const writer = fs.createWriteStream('book.pdf');
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
