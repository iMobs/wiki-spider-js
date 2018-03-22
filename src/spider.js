const axios = require('axios');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const db = require('../database'); 

class Spider {
  constructor() {
    this._axios = axios.create({
      baseURL: 'https://en.wikipedia.org',
    });

    this._queue = [
      '/wiki/Christianity',
      '/wiki/Gary_Busey',
      '/wiki/Hatchet',
      '/wiki/Kevin_Bacon',
      '/wiki/React_(JavaScript_library)',
      '/wiki/Roman_Empire',
      '/wiki/Star_Wars',
      '/wiki/Transhumanism',
    ];

    this._seen = new Set(this._queue);
    this._linkCount = this._queue.length;
  }

  async run() {
    while (this._queue.length) {
      const url = this._queue.shift();
      try {
        const page = await this.getPage(url);
        this.parse(url, page);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getPage(url) {
    try {
      const response = await this._axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error.response.data;
    }
  }

  parse(url, page) {
    url = url.slice(6); 
    const $ = cheerio.load(page);
    let pages = []; 
    $('p').find('a').each((index, tag) => {
      let link = $(tag).attr('href');
      if (RegExp('^/wiki/').test(link) && !RegExp('^/wiki/(File|Help|Wikipedia)').test(link)) {
        this._linkCount++;

        [ link ] = link.match(/\/wiki\/[^#]+/);

        if (!this._seen.has(link)) {
          this._seen.add(link);
          this._queue.push(link);
          pages.push(link.slice(6));
        }
      }
    });
    db.addToQueue(url, pages);
  }
}

module.exports = new Spider();

