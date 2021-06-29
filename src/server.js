const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
const cors = require('cors');

require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(3333);