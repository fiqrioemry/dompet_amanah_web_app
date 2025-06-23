import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis";
import type { SendCommandFn } from "rate-limit-redis";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: ((...args: [string, ...Array<string | number | Buffer>]) => {
      return redis.call(...args);
    }) as unknown as SendCommandFn,
  }),
});

export default limiter;
