require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.listen(3000, () => console.log('Server running on port 3000'));