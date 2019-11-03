
const Mongo = require('../Connection');
const UrlSchema = require('../schemas/url');
const Utils = require('../../Utils');
class Url {

    /**
     * Initialize the URl with URL model
     */
    constructor() {
        this.URL = Mongo.connection.model('url', UrlSchema);
    }

    /**
     * function update the document else insert
     * 
     * if not exist
     * @param {object} URLDoc URL document
     */
    async updateOrInsertIfNotExist(URLDoc) {
        try {
            let doc = {};
            doc["$set"] = URLDoc;
            doc["$inc"] = { "referenceCount": 1 };
            if (URLDoc['params']) {
                doc["$addToSet"] = { "params" : { "$each": URLDoc['params'] } };
            }
            delete URLDoc["params"];
            let updateResult = await this.URL.updateOne({ "url": URLDoc['url'] }, doc, { 'upsert': true });
            return updateResult;
        } catch (err) {
            Utils.registerLogs(Utils.ERROR, err);
            return;
        }
    }

    /**
     * find the documents by urls array
     * @param {array} urls urls array
     * @return {Array}
     */
    async findFromUrlArray(urls) {
        try {
            let urlDocuments = await this.URL.find({ "url": { $in: urls } }, { _id: 0, __v: 0 }).lean();
            return urlDocuments;
        } catch (err) {
            Utils.registerLogs(Utils.ERROR, err);
            return [];
        }
    }

    /**
     * function to create object contains URL and params
     * This function divide the params , url 
     * @param {array} links 
     * @return {array} array of url object
     */
    createURLObjectArray(links) {
        let URL = [];
        let tempURL;
        links.forEach(element => {
            tempURL = {};
            let values = element.split("?");
            if (values.length > 0) {
                tempURL['url'] = values[0]; //0th index will contain the domain
                tempURL['link'] = element; //just to maintain a full link info
                tempURL['params'] = getParamObject(values[1]);
            }
            URL.push(tempURL);
        });
        return URL;
    }
}

//private function for URL
function getParamObject(params) {
    if (!params) {
        return;
    }
    let paramsObject = [];
    let paramsArray = params.split("&");
    paramsArray.forEach(element => {
        paramsObject.push(element.split("=")[0]);
    });
    return paramsObject;
}

module.exports = new Url();