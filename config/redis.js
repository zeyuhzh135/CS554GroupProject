const redis = require("redis");
const settings = require('./settings');
const redisConfig = settings.redisConfig;
let client = undefined;

const getClient = async () => {
    if (!client) {
        client = await redis.createClient(redisConfig.port, redisConfig.url)
    }

    return client;
}

module.exports = getClient