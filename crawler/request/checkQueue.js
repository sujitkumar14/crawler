require('../config');
const Redis = require('../redis/Functions');
const Request = require('request-promise');
const Utils = require('../Utils');

class CheckQueue {}

CheckQueue.queue = "";
CheckQueue.inProcessRequest = 0;
CheckQueue.maxAllowedCurrentRequest = 0;

CheckQueue.start = async function() {
    while (true) {
        try {
            if (CheckQueue.inProcessRequest < CheckQueue.maxAllowedCurrentRequest) {
                CheckQueue.inProcessRequest++;
                let url = await Redis.RPOP(CheckQueue.queue);
                let urlData = await CheckQueue.getRequest(url);
                if (urlData) {
                    process.send({'urlData': urlData});
                    Utils.registerLogs(Utils.LOG, `Scraped ${url}.`);
                }
                CheckQueue.inProcessRequest--;
            }
        } catch (err) {
            Utils.registerLogs(Utils.ERROR, err);
            continue;
        }
    }
}

/**
 * static function Post Request
 */
CheckQueue.getRequest = async function (url) {
    try {
        if (!url) {
            return;
        }
        let response = await Request(url);
        return response;
    } catch (err) {
        Utils.registerLogs(Utils.ERROR, err);
        return undefined;
    }
}

//Communication with parent
process.on('message', (message)=> {
    if (message['type'] == 'start') {
        CheckQueue.queue = message['queue'];
        CheckQueue.inProcessRequest = message['inProcessRequest'];
        CheckQueue.maxAllowedCurrentRequest = message['maxAllowedCurrentRequest'];
        CheckQueue.start();
    } else if (message['type'] == 'changeInProcessRequest') {
        CheckQueue.inProcessRequest = message['inProcessRequest'];
    } else if (message['type'] == 'changeMaxAllowedCurrentRequest') {
        CheckQueue.inProcessRequest = message['changeMaxAllowedCurrentRequest'];
    }
});