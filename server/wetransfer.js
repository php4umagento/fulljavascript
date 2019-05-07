const createWTClient = require('@wetransfer/js-sdk');
const fs = require('fs');

// Create a promise-based function to read files.
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      }

      resolve(data);
    });
  });
}

async function transferFiles(filePaths) {
  // Read the content of the files, in parallel
  const fileContents = await Promise.all(filePaths.map(readFile));

  // Create the files array with names, sizes and content.
  const files = filePaths.map((file, index) => {
    const content = fileContents[index];
    return {
      name: file.split('/').pop(),
      size: content.length,
      content,
    };
  });

  const wtClient = await createWTClient(process.env.WETRANSFER);

  const transfer = await wtClient.transfer.create({
    message: 'Data Structures and Algorithms in JavaScript!',
    files,
  });

  console.log(transfer.url); // https://we.tl/t-t2GQSI14ck
}

// This is variable, and will depend on your application.
const filePaths = ['../dist/dsajs-algorithms-javascript-book-v1.2.2.pdf'];
transferFiles(filePaths);


// // ----


// async function transferText () {
//   // An authorization call is made when you create the client.
//   // Keep that in mind to perform this operation
//   // in the most suitable part of your code
//   const wtClient = await createWTClient(process.env.WETRANSFER);

//   const content = Buffer.from('Look ma, a transfer!');
//   const transfer = await wtClient.transfer.create({
//     message: 'My very first transfer!',
//     files: [
//       {
//         name: 'dsajs-algorithms-javascript-book-v1.2.2.pdf',
//         size: content.length,
//         content,
//       },
//     ],
//   });

//   console.log(transfer.url);
// }

// //----------
