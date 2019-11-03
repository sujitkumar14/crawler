const Redis = require('redis');

class Connection {

    constructor() {
        this.connection = undefined
        this.connect();
    }

    connect() {
        if (!this.connection) {
            this.connection = Redis.createClient(_config.redisURL);
        }
    }
}

module.exports = new Connection();