const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://user:pass@cluster00.hve3n.mongodb.net/table?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log('Działa!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'err';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
