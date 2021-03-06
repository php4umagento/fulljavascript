const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('server:webhook');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Listening for webhooks: http://localhost:${port}`);
  debug(`http://localhost:${port}/webhook`);
});

app.post('/webhook', async (req, res) => {
  const event = req.body;
  debug('Got event %o', event);

  res.sendStatus(200);

  if (event.type === 'payment_intent.succeeded') {
    // TODO: send event to RabbitMQ to further processing

    // FIXME: stop processing request here!
    // Don't want to block it with long processing stuff.
    const { sendPdfToBuyer } = require('./process-pdf');
    sendPdfToBuyer(event);
  }
});

// all other routes
app.route('*', async (req, res) => {
  res.json({ ok: 1 });
});
