// https://devdocs.io/node/https#https_https_get_options_callback
const https = require('https');

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

https.get('https://circleci.com/api/v1.1/project/github/amejiarosario/dsa.js/latest/artifacts?filter=successful&branch=master', options, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  console.log({ statusCode, contentType });

  res.setEncoding('utf8');

  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      console.log(rawData);
      // const parsedData = JSON.parse(rawData);
      // console.log(parsedData);
    } catch (e) {
      // console.error(e.message);
    }
  });

}).on('error', (e) => {
  console.error(e);
});
