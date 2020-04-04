const https = require('https');
const redis = require('socket.io-redis');
const fs = require('fs')

const app = require('./app')
const config = require('./config')

let credentials;
// Certificate
if (process.env.NODE_ENV !== 'dev') {
    const privateKey = fs.readFileSync(
        process.env.NODE_ENV === 'dev' ? 'server.key' : '/etc/letsencrypt/live/sprint-app.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync(
        process.env.NODE_ENV === 'dev' ? 'server.cert' : '/etc/letsencrypt/live/sprint-app.com/cert.pem', 'utf8');
    const ca = process.env.NODE_ENV === 'dev' ? '' : fs.readFileSync(
        process.env.NODE_ENV === 'dev' ? '' : '/etc/letsencrypt/live/sprint-app.com/chain.pem', 'utf8');

    credentials = {
        key: privateKey,
        cert: certificate,
        ca: process.env.NODE_ENV === 'dev' || 'staging' ? '' : ca
    };
}

// Server
const server = https.createServer(credentials, app);

// Atach server to the socket
app.io.attach(server)

// Origin socket configuration
app.io.origins([config.ORIGINS])

// Using the adapter to pass event between nodes
app.io.adapter(redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT
}));

server.listen(config.PORT, () => {
    console.log(`Server Listening on port ${config.PORT}`)
}); 