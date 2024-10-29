import redis from "express-redis-cache";

export const redisCache = redis({
  post: 6379,
  host: "localhost",
  prefix: "backend_practice",
  expire: 60 * 60,
});
