"""Singleton MongoDB client for AWS Lambda and serverless environments."""

from mongo_client.client import MongoDbConnection

__version__ = "1.0.0"
__all__ = ["MongoDbConnection"]
