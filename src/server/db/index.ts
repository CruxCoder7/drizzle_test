import { type NeonQueryFunction, neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from "~/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: NeonQueryFunction<boolean, boolean> | undefined;
};

const conn = globalForDb.conn ?? neon(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
