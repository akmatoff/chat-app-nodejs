const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();

const userRoutes = require('./routes/user');

// Connect to the database
db.authenticate().then(() => console.log('Database connected...')).catch(err => console.log('Error: ' + err));

app.use(morgan('dev')); // Logs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Prevent CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(express.static(path.join(__dirname, 'static')));

// User route
app.use('/user', userRoutes);

module.exports = app;