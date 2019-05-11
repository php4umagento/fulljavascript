const path = require('path');
const Mailgun = require('mailgun-js');

const API_KEY = process.env.MAILGUN;
const DOMAIN = 'mg.adrianmejia.com';
const mailgun = Mailgun({ apiKey: API_KEY, domain: DOMAIN });

function sendEmail(addresses) {
  const data = {
    from: 'noreply@mg.adrianmejia.com',
    to: addresses, // requires to add this address as authorized user and confirm it.
    subject: 'Hello Again',
    text: 'Testing some Mailgun awesomeness!',
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });
}

function sendEmailWithTemplate() {
  const data = {
    from: 'Mailgun Sandbox <postmaster@mg.adrianmejia.com>',
    to: 'Adrian Mejia <adriansky@gmail.com>',
    subject: 'Hello',
    template: 'invoice',
    'h:X-Mailgun-Variables': { test: 'test' },
  };
  mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });
}

function sendEmailWithNiceTemplate() {
  const filepath1 = path.join(__dirname, '../tmp/bookStamped.pdf');
  // const filepath1 = '../tmp/bookStamped.pdf';
  console.log({filepath1});

  const data = {
    from: 'Mailgun Sandbox <postmaster@mg.adrianmejia.com>',
    // to: 'Adrian Mejia <adriansky@gmail.com>, admejiar@cisco.com, adrianmejia86do@yahoo.com',
    to: 'Adrian Mejia <adriansky@gmail.com>',
    replyTo: 'adrianmejia86@hotmail.com',
    subject: 'Hello',
    template: 'titlebody', // https://designmodo.com/postcards/app/
    'h:X-Mailgun-Variables': JSON.stringify({
      title: 'DSA.js Book',
      body: 'Thanks for buying the Data Structure and Algorithms book. You can find it attached to this email.',
    }),
    attachment: [filepath1],
  };
  mailgun.messages().send(data, (error, body) => {
    if (error) console.log(error);
    console.log(body);
  });
}

function getLogs() {
  mailgun.get(`/${DOMAIN}/events`, {
    limit: 10,
  }, (error, body) => {
    console.log(body.items.map(e => [e.event, JSON.stringify(e)]));
  });
}

// cid:image.png doesn't work
function sendEmailWithAttachement() {
  const filepath1 = path.join(__dirname, '../tmp/bookStamped.pdf');
  const filepath2 = path.join(__dirname, '../../dist/logo.png');

  const data = {
    from: 'Excited User <dsa.js@mg.adrianmejia.com>',
    to: 'Adrian Mejia <adriansky@gmail.com>, adrianmejia86do@yahoo.com',
    // to: 'Adrian Mejia <adriansky@gmail.com>',
    // cc: 'adrianmejia86@hotmail.com',
    bcc: 'admejiar@cisco.com',
    subject: 'Complex',
    text: 'Testing some Mailgun awesomness!',
    html: '<html>HTML version of the body <br><img src="cid:logo.png">with width<br><img src="cid:logo.png" width="200px"> </html>',
    attachment: [filepath1, filepath2],
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });
}

// getLogs();
// sendEmail('adriansky@gmail.com, adrianmejia86@hotmail.com, adrianmejia86do@yahoo.com, admejiar@cisco.com');
// sendEmail('Adrian Mejia <adriansky@gmail.com>');
// sendEmailWithTemplate();
// sendEmailWithAttachement();
sendEmailWithNiceTemplate();
