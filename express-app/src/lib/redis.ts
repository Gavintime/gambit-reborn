import { Redis } from "ioredis";
import Debug from "debug";

const debug = Debug("gambit:redis-client");

const { REDIS_HOST, REDIS_PORT } = process.env;

if (!REDIS_HOST || !REDIS_PORT) {
  debug("redis env vars not set");
  process.exit(1);
}

debug("Connecting...");
// sub and pub must be seperate connections
const redisSub = new Redis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
});
const redisPub = new Redis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
});
debug("Connected!");

export { redisSub, redisPub };
