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

  insert() {
    if (!this._operating) {
      let parent = this._queue.parents.shift(); 
      let children = this._queue.children.shift(); 

      let query = 'WITH $children AS coll UNWIND coll AS child MERGE (n:Page { name: $parent }) MERGE (y)-[:LINKS_TO]->(m:Page { name: child }) RETURN n.name'; 
      
      let transaction = session.writeTransaction(tx => 
        tx.run(query, { parent: parent, children: children })
      )
      transaction.then(result => {
        session.close(); 
        driver.close(); 
        this._operating = true;
        console.log(result) 
      })
    }
  }

}


module.exports = new Graph();



// resultPromise.then(result => {
//   session.close();

//   const rec = result.records[0];
//   const res = rec.get(0);
//   console.log(res);

//   driver.close();
// });

