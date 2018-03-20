require('dotenv').config(); 
const neo4j = require('neo4j-driver').v1;
const user = process.env.DB_USER; 
const password = process.env.DB_PASS; 
const uri = process.env.DB_URI; 
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

let query = 'CREATE (n:Page { name: "name", primary_category: "primaryCategory" }) RETURN n'; 
let resultPromise = session.writeTransaction(tx => tx.run(query));

resultPromise.then(result => {
  session.close();

  const rec = result.records[0];
  const res = rec.get(0);
  console.log(res);

  driver.close();
});

