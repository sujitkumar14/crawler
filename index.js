require('./crawler/config');
const Crawler = require('./crawler/Crawler');
const RequestManager = require('./crawler/request/RequestManager');
const Redis = require('./crawler/redis/Functions');
const DB = require('./crawler/database/Connection');

const QueueName = "medium";
const DomainName = "medium.com";
start();

async function getStartingPoint() {
    let start = await Redis.RPOP(QueueName);
    return start || "https://medium.com";
}

async function start() {
    const StartingPoint = await getStartingPoint();

    //start request manager to handler request
    let requestManager = new RequestManager(QueueName);
    requestManager.start();


    //start crawler
    let crawler = new Crawler(QueueName, DomainName);
    crawler.start(StartingPoint);
}