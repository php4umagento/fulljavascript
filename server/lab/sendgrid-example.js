const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID);

const msg = {
  from: 'hi+dsajs@adrianmejia.com',
  replyTo: 'hello@adrianmejia.com',
  to: 'adriansky@gmail.com',
  bcc: ['adrianmejia86do@hotmail.com'],
  templateId: 'd-fb87aa68af9e435383c3018b4e4a301f',
  dynamic_template_data: {
    downloadUrl: 'https://we.tl/t-t2GQSI14ck',
  },
  attachments: [
    {
      content: Buffer.from('Some base 64 encoded attachment content').toString('base64'),
      filename: 'some-attachment.txt',
      type: 'plain/text',
      disposition: 'attachment',
      // contentId: 'mytext',
    },
  ],
};

sgMail
  .send(msg)
  .then(() => console.log('Mail sent successfully'))
  .catch(error => console.error(error.toString()));

  // .then(() => {
  //   console.log('message sent!', msg);
  // })
  // .catch((error) => {
  //   // Log friendly error
  //   console.error(error.toString());

  //   // Extract error msg
  //   const { message, code, response } = error;

  //   // Extract response msg
  //   const { headers, body } = response;

  //   console.log(code, message, headers, body, response);
  // });

// // using Twilio SendGrid's v3 Node.js Library
// // https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID);
// const msg = {
//   to: 'blanca.ncabral@gmail.com',
//   from: 'hi+dsajs@adrianmejia.com',
//   subject: 'You bought Data Structures and Algorithms in JavaScript!',
//   text: 'Thanks for purchasing this book, you can download it from here: https://we.tl/t-t2GQSI14ck',
//   html: '<h2>Thanks for purchasing this book</h2><p>You can <a href="https://we.tl/t-t2GQSI14ck">download your book here</a></p>',
// };

// sgMail.send(msg);

// console.log(sgMail);


async function sendEmail({ stampedPdfPath, email, fileName }) {
  sendgrid.setApiKey(process.env.SENDGRID);

  const attachmentBuffer = await filePathToBuffer(stampedPdfPath);

  const message = {
    from: 'hi+dsajs@adrianmejia.com',
    // replyTo: 'hello@adrianmejia.com',
    to: email,
    // bcc: ['adrianmejia86@hotmail.com'],
    templateId: 'd-fb87aa68af9e435383c3018b4e4a301f',
    dynamic_template_data: {
      downloadUrl: 'https://we.tl/t-t2GQSI14ck',
    },
    attachments: [
      {
        content: attachmentBuffer.toString('base64'),
        filename: fileName,
        type: 'application/pdf',
        disposition: 'attachment',
        // contentId: 'mytext',
      },
    ],
  };

  sendgrid
    .send(message)
    .then(() => debug('Mail sent successfully'))
    .catch(error => console.error(error.toString()));
}
