import mongoose from "mongoose";

/**
 * Cached Mongoose connection.
 *
 * In development Next.js clears the module cache on every request, which would
 * otherwise open a new connection each time. We cache the connection promise on
 * the global object to reuse it across hot reloads and requests.
 */

const MONGODB_URI = process.env.MONGODB_URI;

/** True when a database is configured. When false, the app uses static defaults. */
export const isDbConfigured = Boolean(MONGODB_URI && MONGODB_URI.trim() !== "");

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ?? (global._mongooseCache = { conn: null, promise: null });

/** Connect to MongoDB (reusing a cached connection). Throws if not configured. */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!isDbConfigured) {
    throw new Error("MONGODB_URI is not set");
  }
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
