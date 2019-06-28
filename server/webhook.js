const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('server:webhook');

const { sendArtifacts } = require('./src/send-artifacts');

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
    sendArtifacts(event);
  }
});

// all other routes
app.route('*', async (req, res) => {
  res.json({ ok: 1 });
});
