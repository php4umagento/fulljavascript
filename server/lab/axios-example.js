const axios = require('axios');

const url = 'https://circleci.com/api/v1.1/project/github/amejiarosario/dsa.js/latest/artifacts?filter=successful&branch=master';

axios.get(url)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
