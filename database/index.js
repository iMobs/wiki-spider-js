const neo4j = require('neo4j-driver').v1;
const user = process.env.DB_USER; 
const password = process.env.DB_PASS; 
const uri = process.env.DB_URI; 
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

class Graph {
  constructor() {
    this._queue = {
      parents: [], 
      children: [], 
    }; 
  }

  addToQueue(parent, children) {
    this._queue.parents.push(parent); 
    this._queue.children.push(children); 
    this.insert(); 
  }

  async insert() {
    const session = driver.session();
    while (this._queue.parents.length) {
      let parent = this._queue.parents.shift(); 
      let children = this._queue.children.shift(); 
      try {
        const query = 'WITH $children AS coll UNWIND coll AS child MERGE (n:Page { name: $parent }) MERGE (n)-[:LINKS_TO]->(m:Page { name: child }) RETURN n.name'; 
      
        const transaction = await session.writeTransaction(tx => 
          tx.run(query, { parent: parent, children: children })
        )
      } catch (error) {
        console.log(error); 
      }
      
    }
    session.close(); 
    driver.close(); 
  }
}

module.exports = new Graph();
