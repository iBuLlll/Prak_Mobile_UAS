require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const balanceRoutes = require('./routes/balance');

const app = express();

// Connect to database
connectDB();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Selamat datang ke backend');
});

app.use('/', balanceRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
