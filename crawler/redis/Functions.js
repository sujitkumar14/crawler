
const Redis = require('./Connection');

class Functions {

    constructor() {
        this.connection = Redis.connection;
    }

    LPUSH(key, value) {
        this.connection.LPUSH(key, value);
    }

    RPOP(key) {
        return new Promise((resolve,reject)=> {
            this.connection.RPOP(key, (err, value)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }
}

module.exports = new Functions();
