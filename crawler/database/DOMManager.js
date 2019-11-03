

const Cheerio = require('cheerio');

class DOMManager {

    constructor(dom) {
        this.$ = Cheerio.load(dom);
    }

    /**
     * function to parse all the links
     * from DOM
     * @returns {Array}
     */
    getAllLinks() {
        let links = this.$('a');
        let allLinks = [];
        let self = this;
        this.$(links).each((i, link)=>{
            allLinks.push(self.$(link).attr('href'));
        });
        return allLinks;
    }
}

module.exports = DOMManager;