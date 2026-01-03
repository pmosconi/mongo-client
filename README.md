# MongoDB Client

Singleton MongoDB connection manager available for both TypeScript and Python, optimized for serverless environments like AWS Lambda.

## Features

- 🚀 Async/await support
- 🔄 Singleton pattern for connection reuse
- 🔒 Thread-safe connection initialization
- ⚙️ Environment-based configuration
- 📦 Connection pooling optimized for serverless
- ⏱️ Configurable timeouts and pool size
- 🎯 Designed for AWS Lambda and similar platforms

## Why This Library?

In serverless environments (AWS Lambda, Azure Functions, etc.), creating a new database connection for every request is expensive and slow. This library solves that by:

1. **Connection Reuse**: Maintains a single connection pool across function invocations
2. **Singleton Pattern**: Ensures only one connection is created per runtime
3. **Concurrency Handling**: Safely handles multiple concurrent connection requests
4. **Optimized Configuration**: Pre-configured timeouts and pool sizes for serverless

## Implementations

### TypeScript / Node.js
📖 [TypeScript Documentation](./Typescript/README.md)

```bash
npm install @actvalue/mongo-client
```

### Python
📖 [Python Documentation](./Python/README.md)

```bash
pip install actvalue.mongo-client
```

## Quick Start

### TypeScript

```typescript
import { mongo } from '@actvalue/mongo-client';

// Set environment variables
process.env.MONGO_URL = 'mongodb+srv://<your-connection>/database';
process.env.MONGO_POOL_SIZE = '5'; // optional, default is 5

// Use in your code
const db = await mongo.getDb();
const users = db.collection('users');
await users.insertOne({ username: 'test123', password: 'test123' });

// Connection is automatically reused in subsequent calls
const db2 = await mongo.getDb(); // Returns the same connection
```

### Python

```python
import asyncio
import os
from mongo_client import MongoDbConnection

# Set environment variables
os.environ['MONGO_URL'] = 'mongodb+srv://<your-connection>/database'
os.environ['MONGO_POOL_SIZE'] = '5'  # optional, default is 5

# Create instance at module level
mongo = MongoDbConnection()

async def main():
    # Use in your code
    db = await mongo.get_db()
    users = db['users']
    await users.insert_one({'username': 'test123', 'password': 'test123'})
    
    # Connection is automatically reused in subsequent calls
    db2 = await mongo.get_db()  # Returns the same connection

asyncio.run(main())
```

## AWS Lambda Usage

Both implementations work seamlessly in serverless environments:

### TypeScript Lambda

```typescript
import { mongo } from '@actvalue/mongo-client';

// Connection is initialized outside handler for reuse
export const handler = async (event: any) => {
  const db = await mongo.getDb();
  const collection = db.collection('items');
  
  const result = await collection.findOne({ _id: event.id });
  return { statusCode: 200, body: JSON.stringify(result) };
};
```

### Python Lambda

```python
import os
from mongo_client import MongoDbConnection

async def lambda_handler(event, context):
    # IMPORTANT: Initialize within handler due to asyncio event loop limitations
    mongo = MongoDbConnection()
    
    db = await mongo.get_db()
    collection = db['items']
    
    result = await collection.find_one({'_id': event['id']})
    return {'statusCode': 200, 'body': result}
```

> ⚠️ **Python Lambda Note**: The Python client must be initialized inside the handler function due to asyncio event loop binding. Lambda may create new event loops between invocations, and AsyncMongoClient is bound to the loop it was created on. The TypeScript version does not have this limitation.

## Configuration

Both implementations use the same environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | Required |
| `MONGO_POOL_SIZE` | Connection pool size | `5` |

Connection settings optimized for serverless:
- **Connect Timeout**: 30 seconds
- **Socket Timeout**: 24 minutes (for long-running queries)
- **Max Idle Time**: 3 seconds (for quick cleanup)

## Development Setup

### Prerequisites

- Node.js 18+ (for TypeScript)
- Python 3.13+ (for Python)
- uv (for Python package management)
- MongoDB (for testing)

### Install Dependencies

```bash
# Install all dependencies
make install

# Or install individually
make install-ts
make install-py
```

### Run Tests

```bash
# Run all tests
make test

# Or run individually
make test-ts
make test-py
```

### Build Packages

```bash
# Build both packages
make build-ts
make build-py
```

### Publish Packages

```bash
# Publish TypeScript to npm
make publish-ts

# Publish Python to PyPI
make publish-py

# Or publish to Test PyPI first
make publish-py-test
```

## Project Structure

```
mongo-client/
├── Typescript/          # TypeScript implementation
│   ├── src/
│   │   └── index.ts    # Main singleton implementation
│   ├── test/
│   │   └── mongo-client.test.ts
│   ├── package.json
│   └── README.md
├── Python/              # Python implementation
│   ├── src/
│   │   └── mongo_client/
│   │       ├── __init__.py
│   │       └── client.py
│   ├── tests/
│   │   └── test_mongo_client.py
│   ├── pyproject.toml
│   └── README.md
├── Makefile            # Build and development automation
└── README.md           # This file
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Makefile Commands

Run `make help` to see all available commands:

```bash
make help
```

Key commands:
- `make install` - Install dependencies for both languages
- `make test` - Run tests for both languages
- `make clean` - Clean build artifacts
- `make build-ts` / `make build-py` - Build packages
- `make lint-ts` / `make lint-py` - Lint code
- `make format-py` - Format Python code
