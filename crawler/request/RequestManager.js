const Request = require('request-promise');
const EventEmitter = require('events');
const ChildProcess = require('child_process');

class RequestManager {

    //initialize the request Manager with Event/Queue Name
    constructor(queue) {
        this.queue = queue;
    }

    //start the Request Manager to request and emit response
    async start() {
        this.childProcess = ChildProcess.fork(`${__dirname}/checkQueue.js`);
        this.startChildProcess();
        this.childProcess.on('message', async (message)=>{
            let urlData = message['urlData'];
            if (urlData) {
                if (urlData) {
                    broadcast(this.queue, urlData);
                }
            }
        });
    }

    startChildProcess() {
        this.childProcess.send({
            'type': 'start',
            'queue': this.queue,
            'inProcessRequest': RequestManager.inProcessRequest,
            'maxAllowedCurrentRequest': RequestManager.maxAllowedCurrentRequest
        });
    }
}

//static variables 
RequestManager.inProcessRequest = 0;
RequestManager.maxAllowedCurrentRequest = 5;
RequestManager.emitter = new EventEmitter.EventEmitter();

/**
 * function return boolean is link contain domain or not
 * domain = medium.com, google.com
 */
RequestManager.isLinkContainDomain = function (link, domain) {
    if (!link) {
        return;
    }
    link = link.toLowerCase();
    return link.includes(domain);
}

/**
 * function checks the links that contains the domain
 * @param {array} links
 * @param {string} domain
 * @return {array} 
 */
RequestManager.getLinksContainDomain = function (links, domain) {

    let validLinks = links.filter((element) => {
        return RequestManager.isLinkContainDomain(element, domain);
    });
    return validLinks;
}

/**
 * private function
 * 
 * broadcast function informs all the 
 * event listeners about the urls data
 * @param data
 */
function broadcast(eventName, data) {
    RequestManager.emitter.emit(eventName, data);
}

module.exports = RequestManager;