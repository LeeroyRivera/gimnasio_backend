const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server listening on http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Gym API' });
});

module.exports = app;
