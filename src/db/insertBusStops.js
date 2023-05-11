const { MongoClient } = require('mongodb');

const config = require('../config/config.js');
console.log(config.development.AccountKey);

require('dotenv').config({ path: __dirname + '/../../.env' });

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mbbwtrn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);

const axios = require('axios');

// The database to use
const dbName = 'bus';

async function run() {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use the collection "buses"
    const collection = db.collection('buses');

    let documents = [];
    // there are ~5080 bus stops
    for (let i = 0; i < 11; i++) {
      const busStops = await axios.get(
        `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${
          i * 500
        }`,
        {
          headers: {
            AccountKey: config.development.AccountKey,
          },
        }
      );

      let stops = busStops.data.value;

      for (let stop of stops) {
        documents.push(stop);
      }
    }
    // console.log(documents);

    // await collection.insertMany(documents);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
