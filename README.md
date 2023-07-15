# @actvalue/mongo-client

![npm version](https://badgen.net/npm/v/@actvalue/mongo-client)
![npm tot downloads](https://badgen.net/npm/dt/@actvalue/mongo-client)
![npm license](https://badgen.net/npm/license/@actvalue/mongo-client)

Singleton client for MongoDB connection

## Install
```bash
npm i @actvalue/mongo-client
```

## Client Usage

The client is used to create and share MongoDB connection pool.

```javascript
import { mongo } from '@actvalue/mongo-client';

// initialize you connection parameters and optionally set pool size
process.env.MONGO_URL = 'mongo+srv://<your-connection>/database';
process.env.MONGO_POOL_SIZE = "5"; // default value

// create connection pool if not existing already
const db = await mongo.getDb();
const users = db.collection("users");
await users.insertOne({ username: "test123", password: "test123" });

// some other time, some other place in code
// connection pool is reused
const db = await mongo.getDb();
const user = await users.findOne({ username: "test123" });
```
