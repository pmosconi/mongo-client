import { MongoClient, Db } from 'mongodb';

const connectTimeoutMS = 30000;

let _db: Db | undefined;
let _isConnecting = { value: false }; // an object so latest vallue is available by reference

class MongoDbConnection {
  
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async mongoConnect(): Promise<Db> {
    try {
      _isConnecting.value = true;
      const client = new MongoClient(process.env.MONGO_URL!, {
        minPoolSize: process.env.MONGO_POOL_SIZE ? parseInt(process.env.MONGO_POOL_SIZE) : 5,
        connectTimeoutMS,
        socketTimeoutMS: 1440000,
        maxIdleTimeMS: 3000,
        ignoreUndefined: true,
      });
      await client.connect();
      const db = client.db();
      _db = db;
      _isConnecting.value = false;
      return db;
    } catch (error) {
      console.error(error);
      _db = undefined;
      throw error;
    }
  }

  async getDb(): Promise<Db> {
    if (_db) return _db;
    for (let i = 0; _isConnecting.value && i < connectTimeoutMS / 100; i++) {
      await this.delay(100);
    }
    return _db ? _db : this.mongoConnect();
  }
}

const mongo = new MongoDbConnection();
export { mongo };
