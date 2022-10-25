const express = require('express');
const { createClient } = require('redis');
const cors = require('cors');

const app = express();

const client = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Redis Client Connected'));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/set', async (req, res) => {
  const { key, value } = req.body;
  await client.set(key, value);
  res.send('OK');
})

app.post('/get', async (req, res) => {
  const { key } = req.body;
  const value = await client.get(key);
  res.json({
    key,
    value,
  });
})

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
