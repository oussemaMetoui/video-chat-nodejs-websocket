const https = require('https');
const redis = require('socket.io-redis');
const fs = require('fs')

const app = require('./app')
const config = require('./config')

let credentials = {
    key: fs.readFileSync('server.key', 'utf8'),
    cert: fs.readFileSync('server.cert', 'utf8'),
};

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