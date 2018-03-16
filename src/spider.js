const axios = require('axios');
const cheerio = require('cheerio');

class Spider {
  constructor() {
    this._axios = axios.create({
      baseURL: 'https://en.wikipedia.org/wiki',
    });

    this._visited = new Map();
    this._queue = [];
  }

  async getPage(url) {
    const page = await this._axios.get(url);
  }
}
