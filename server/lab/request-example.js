const request = require('request');

const url = 'https://circleci.com/api/v1.1/project/github/amejiarosario/dsa.js/latest/artifacts?filter=successful&branch=master';

request(url, (error, response, body) => {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  console.log(JSON.parse(body));
});
