import { config } from "dotenv";
import { resolve } from "node:path";

export const NODE_ENV = process.env.NODE_ENV;

const envPath = {
  development: ".env.development",
  production: ".env.production",
};

config({ path: resolve(`./config/${envPath[NODE_ENV]}`) });

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const SALT_ROUND = parseInt(process.env.SALT_ROUND);
export const IV_LENGTH = parseInt(process.env.IV_LENGTH)
export const ENC_SECRET_KEY = Buffer.from(process.env.ENC_SECRET_KEY)
export const TOKEN_ACCESS_SECRET_KEY = process.env.TOKEN_ACCESS_SECRET_KEY;
export const TOKEN_REFRESH_SECRET_KEY = process.env.TOKEN_REFRESH_SECRET_KEY;
export const SYSTEM_TOKEN_ACCESS_SECRET_KEY = process.env.SYSTEM_TOKEN_ACCESS_SECRET_KEY;
export const SYSTEM_TOKEN_REFRESH_SECRET_KEY = process.env.SYSTEM_TOKEN_REFRESH_SECRET_KEY;
export const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN);
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
