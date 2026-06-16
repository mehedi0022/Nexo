import { redis } from "../config/redis.js";

async function testRedis() {
  await redis.set("test_key", "Hello Redis");

  const value = await redis.get("test_key");

  console.log(value);

  await redis.del("test_key");

  process.exit(0);
}

testRedis();
