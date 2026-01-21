const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient({ url: redisUrl });
const promisify = require("util").promisify;
const getCache = promisify(client.get).bind(client);

const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    const key = "__express__" + (req.originalUrl || req.url);

    try {
      const cachedData = await getCache(key);
      if (cachedData) {
        console.log("return from redis");
        res.set("X-Cache", "HIT");
        res.send(JSON.parse(cachedData));
      } else {
        res.set("X-Cache", "MISS");
        let responseBody;

        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);

        res.json = (body) => {
          responseBody = body;
          return originalJson(body);
        };

        res.send = (body) => {
          responseBody = body;
          return originalSend(body);
        };

        res.once("finish", async () => {
          if (res.statusCode === 200 && responseBody !== undefined) {
            try {
              await client.set(key, JSON.stringify(responseBody), {
                EX: duration,
              });
            } catch (err) {
              console.error("Redis SET failed:", err);
            }
          }
        });
        next();
      }
    } catch (error) {
      next();
    }
  };
};

const clearCache = function (req, res, next) {
  console.log("clearcache");
  const key = "__express__" + (req.originalUrl || req.url);
  client.del(key);
  next();
};

module.exports = { cacheMiddleware, clearCache };
