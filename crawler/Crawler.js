const RequestManager = require('./request/RequestManager');
const Redis = require('./redis/Functions');
const DOMManager = require('./database/DOMManager');
const Utils = require('./Utils');
const URLModel = require('./database/models/url');

class Crawler {

    //Initialize the crawler with queue and domain
    constructor(queue, domain) {
        this.queue = queue;
        this.domain = domain;
    }

    //start the crawler
    start(url) {
        this.crawl(url);
        this.findPathByURL();
    }

    //crawling with url
    crawl(url) {
        Utils.registerLogs(Utils.LOG, `Scraping ${url}...`);
        Redis.LPUSH(this.queue, url);
    }

    /**
     * FindPath function finds the Urls in 
     * received data and then crawl
     */
    async findPathByURL() {
        RequestManager.emitter.on(this.queue, async (urlData) => {
            try {
                let domManager = new DOMManager(urlData);
                let links = RequestManager.getLinksContainDomain(Utils.removeDuplicate(domManager.getAllLinks()), this.domain);
                let newPaths = await this.findAndInsertNewPathsAndUpdateOld(links);
                newPaths.forEach(element => this.crawl(element));
            } catch (err) {
                Utils.registerLogs(Utils.ERROR, err);
            }
        });
    }

    /**
     * findNewPaths function find the new unique URL 
     * That not exist in DB
     * This function finds the new URL by comparing exising DB URLs
     * @param {array} links 
     * @return {Array}
     */
    async findAndInsertNewPathsAndUpdateOld(links) {
        let uniqueURLs = [];
        try {
            let URLArray = URLModel.createURLObjectArray(links);
            let urls = URLArray.map(element => element['url']);
            let urlDocuments = await URLModel.findFromUrlArray(urls);
            let existingUrls = urlDocuments.map(element => element['url']);
            uniqueURLs = Utils.getNotIntersectedElements(urls, existingUrls);
            //update old and insert new docs
            URLArray.forEach(element => {
                URLModel.updateOrInsertIfNotExist(element);
            });
            return uniqueURLs;
        } catch (err) {
            Utils.registerLogs(Utils.ERROR, err);
            return uniqueURLs;
        }
    }
}


module.exports = Crawler;
