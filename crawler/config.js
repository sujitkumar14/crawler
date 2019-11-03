
let config = {
    'redisURL' : process.env.REDIS || "",
    'mongoURL' : process.env.MONGO || "mongodb://127.0.0.1:27017/crawler"
}
global['_config'] = config;
module.exports = config;
