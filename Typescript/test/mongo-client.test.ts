import { expect, test, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "vitest-mongodb";
import { mongo } from "../src/index";

declare global {
  var __MONGO_URI__: string;
}
 
beforeAll(async () => {
  await setup();
  process.env.MONGO_URL = `${globalThis.__MONGO_URI__}testdb`;
  process.env.MONGO_POOL_SIZE = "10";
});

afterAll(async () => {
  await teardown();
});

// check basic functionality
test("mongo-client", async () => {
  const db = await mongo.getDb();
  let collections = await db.listCollections().toArray();
  expect(collections.length).toBe(0);

  const users = db.collection("users");
  await users.insertOne({ username: "test123", password: "test123" });
  const docs = await users.find({ username: "test123" }).toArray();
  expect(docs.length).toBe(1);
  
  collections = await db.listCollections().toArray();
  expect(collections.length).toBe(1);
});

// check reusing the same connection
test("mongo-client reuse", async () => {
  const db = await mongo.getDb();
  const users = db.collection("users1");
  await users.insertOne({ username: "test123", password: "test123" });

  const db1 = await mongo.getDb();
  const users1 = db1.collection("users1");
  await users1.findOne({ username: "test123" });

  expect(db).toEqual(db1);
});

// check concurrent connections
test("mongo-client concurrent reuse", async () => {
  const [db, db1] = await Promise.all([mongo.getDb(), mongo.getDb()]);

  const users = db.collection("users2");
  await users.insertOne({ username: "test123", password: "test123" });

  const users1 = db1.collection("users2");
  await users1.findOne({ username: "test123" });

  expect(db).toEqual(db1);
});