import express, { Request, Response } from "express";
import NodeCache from "node-cache";

const CACHE_TTL = parseInt(process.env.CACHE_TTL || "10", 10);
const myCache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 15 });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  const key = "/";
  const cachedData = myCache.get(key);

  if (cachedData) {
    console.log(`[CACHE HIT] ${key}`);
    return res.json(cachedData);
  }

  console.log(`[CACHE MISS] ${key}`);
  const data = { message: "Hello, with node-cache!", timestamp: new Date() };
  myCache.set(key, data, CACHE_TTL);
  res.json(data);
});

// Endpoint to clean cache
app.delete("/cache", (req, res) => {
  myCache.flushAll();
  console.log("[CACHE CLEARED]");
  res.json({ message: "Cache cleared" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🕒 Cache TTL: ${CACHE_TTL} seconds`);
});
