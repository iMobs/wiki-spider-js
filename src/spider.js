const axios = require('axios');
const cheerio = require('cheerio');
const Promise = require('bluebird');

class Spider {
  constructor() {
    this._axios = axios.create({
      baseURL: 'https://en.wikipedia.org',
    });

    this._queue = [
      '/wiki/Adolf_Hitler',
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
        console.log(`Parsing ${url}`)

        const page = await this.getPage(url);
        this.parse(page);
  
        console.log(`Seen ${this._linkCount} links`);
        console.log(`${this._queue.length} in the queue`);
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

  parse(page) {
    const $ = cheerio.load(page);

    $('p').find('a').each((index, tag) => {
      let link = $(tag).attr('href');

      if (RegExp('^/wiki/').test(link) && !RegExp('^/wiki/(File|Help|Wikipedia)').test(link)) {
        this._linkCount++;

        [ link ] = link.match(/\/wiki\/[^#]+/);

        if (!this._seen.has(link)) {
          this._seen.add(link);
          this._queue.push(link);
        }
      }
    });
  }
}

module.exports = new Spider();
