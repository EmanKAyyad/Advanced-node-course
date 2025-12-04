const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient({ url: redisUrl });

const cacheMiddleware = (duration = 3600) => {
  return (req, res, next) => {
    console.log("cache");
    if (req.method !== "GET") {
      return next();
    }

    const key = "__express__" + (req.originalUrl || req.url);

    client.get(key, (err, data) => {
      if (data) {
        res.set("X-Cache", "HIT");
        res.send(JSON.parse(data));
      } else {
        res.set("X-Cache", "MISS");
        const originalSend = res.send;

        res.send = function (data) {
          client.set(key, JSON.stringify(data), { EX: duration });
          originalSend.call(this, data);
        };

        next();
      }
    });
  };
};

const clearCache = function (req, res, next) {
  console.log("clearcache");
  const key = "__express__" + (req.originalUrl || req.url);
  client.del(key);
};

module.exports = { cacheMiddleware, clearCache };
