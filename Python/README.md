# actvalue.mongo-client

![PyPI version](https://badgen.net/pypi/v/actvalue.mongo-client)
![Python versions](https://badgen.net/pypi/python/actvalue.mongo-client)
![License](https://badgen.net/pypi/license/actvalue.mongo-client)

Singleton client for MongoDB connection

## Install

```bash
pip install actvalue.mongo-client
```

Or with uv:

```bash
uv add actvalue.mongo-client
```

## Client Usage

The client is used to create and share MongoDB connection pool.

```python
import asyncio
import os
from mongo_client import MongoDbConnection

# Initialize your connection parameters and optionally set pool size
os.environ['MONGO_URL'] = 'mongodb+srv://<your-connection>/database'
os.environ['MONGO_POOL_SIZE'] = '5'  # default value

# Create a singleton instance at module level
mongo = MongoDbConnection()

async def main():
    # Create connection pool if not existing already
    db = await mongo.get_db()
    users = db["users"]
    await users.insert_one({"username": "test123", "password": "test123"})
    
    # Some other time, some other place in code
    # Connection pool is reused
    db = await mongo.get_db()
    user = await users.find_one({"username": "test123"})
    print(user)

asyncio.run(main())
```

## AWS Lambda Usage

Perfect for serverless environments where connection reuse is critical:

```python
import os
from mongo_client import MongoDbConnection

# Set environment variables (typically from Lambda configuration)
os.environ['MONGO_URL'] = 'mongodb+srv://...'
os.environ['MONGO_POOL_SIZE'] = '5'

async def lambda_handler(event, context):
    # IMPORTANT: Initialize within handler due to Python asyncio event loop limitations
    # Each Lambda invocation may create a new event loop, and AsyncMongoClient
    # is bound to the event loop it was created on
    mongo = MongoDbConnection()
    
    db = await mongo.get_db()
    collection = db["my_collection"]
    
    result = await collection.find_one({"_id": event["id"]})
    return {"statusCode": 200, "body": result}
```

> ⚠️ **Python Lambda Note**: Unlike the TypeScript version, the Python client should be initialized inside the handler function. This is because Python's AsyncMongoClient binds to the asyncio event loop at creation time. AWS Lambda may create new event loops between invocations, causing "Cannot use AsyncMongoClient in different event loop" errors if the instance is created at module level.

## Features

- 🚀 Async/await support with PyMongo 4.0+
- 🔄 Singleton pattern for connection reuse
- 🔒 Thread-safe connection initialization
- ⚙️ Environment-based configuration
- 📦 Connection pooling optimized for serverless
- ⏱️ Configurable timeouts and pool size
- 🎯 Designed for AWS Lambda and similar platforms

## Environment Variables

- `MONGO_URL`: MongoDB connection string (required)
- `MONGO_POOL_SIZE`: Connection pool size (optional, default: "5")

## License

MIT
