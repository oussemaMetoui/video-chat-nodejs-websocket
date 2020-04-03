var https = require('https');
const redis = require('socket.io-redis');

const app = require('./app')
const config = require('./config')

// Credentials
const privateKey = fs.readFileSync('/etc/letsencrypt/live/sprint-app.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/sprint-app.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/sprint-app.com/chain.pem', 'utf8');
let credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
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