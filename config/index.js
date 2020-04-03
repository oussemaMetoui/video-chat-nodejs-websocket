const CONFIG = {
    PORT: process.env.PORT || 3001,
    CHAT_NAMESPACE: '/video-chat',
    REDIS_HOST: 'redis-server',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    ORIGINS: process.env.ORIGINS || '*:*',
    KEY: 'unique'
}

module.exports = CONFIG