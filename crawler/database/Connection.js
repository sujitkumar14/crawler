
const Mongoose = require('mongoose');
Mongoose.set('useCreateIndex', true);
class Connection {

    constructor() {
        this.connection = undefined;
        this.connect();
    }

    connect() {
        if (!this.connection) {
            this.connection = Mongoose.createConnection(_config.mongoURL, 
                {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                });
        }
    }
}

module.exports = new Connection();