const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(bodyParser.json())
app.use("/upload", express.static(path.join(__dirname, "upload")));

const loginRoute = require('./routes/login');
app.use('/', loginRoute);

const createAccRoute = require('./routes/create_account');
app.use('/', createAccRoute);

const menuRoute = require('./routes/menu');
app.use('/', menuRoute);

const orderRoute = require('./routes/order');
app.use('/', orderRoute);

const cartRoute = require('./routes/cart');
app.use('/', cartRoute);

app.listen(8000, ()=>{
    console.log('Server Berjalan di Port : 8000');
});