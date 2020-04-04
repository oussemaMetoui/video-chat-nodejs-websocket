const express = require('express');
const app = express();
const io = app.io = require('socket.io')();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const users = require('./routes/user');
const rooms = require('./routes/room');
const chat = require('./chat_namespace');

app.use(cors())

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    res.header(
        'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key'
    );
    res.setHeader("Content-Security-Policy", "script-src 'self' *");
    res.header('X-Content-Security-Policy', 'default-src *');
    res.header('X-WebKit-CSP', 'default-src *');
    res.header('Access-Control-Allow-Credentials', 'true');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

app.use(bodyParser.json());

/**
 * Middleware
 */
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

/**
 * Routing
 */
app.get('/', (req, res) => res.send('Hello From video chat server!'));
app.use('/auth', users)
app.use('/rooms', rooms)

// Static routing
// app.use(express.static(path.join(__dirname, '../dist')));

/**
 * Chat socket namespace
 */
chat.createNameSpace(io)

module.exports = app