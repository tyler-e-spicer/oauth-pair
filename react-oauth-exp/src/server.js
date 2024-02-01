const path = require('path');
const cors = require('cors');
const express = require('express');
const controller = require('./controller');

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('dist/app'));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'app/index.html'));
});

console.log('We hit the post route.');

app.post('/login', controller.login, (req, res) => {
  return res.status(200).json({message: 'You are logged in!'});
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  return res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
