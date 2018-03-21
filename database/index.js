require('dotenv').config(); 
const neo4j = require('neo4j-driver').v1;
const user = process.env.DB_USER; 
const password = process.env.DB_PASS; 
const uri = process.env.DB_URI; 
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

class Graph {
  constructor() {
    this._queue = {
      parents: [], 
      children: [], 
    }; 
    this._operating = false; 
  }

  addToQueue(parent, children) {
    this._queue.parents.push(parent); 
    this._queue.children.push(children); 
    this.insert(); 
  }

  insert(parent, children) {
    if (!this._operating) {

    }
  }
  
}


module.exports = new Graph();
