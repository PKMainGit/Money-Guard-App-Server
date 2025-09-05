// src/db/dbConnect.js
import { Pool } from "pg"
import { getEnvVar } from "../utils/getEnvVar.js"

export const pool = new Pool({
  port: getEnvVar('DB_PORT'),
  user: getEnvVar('USER_NAME'),
  password: getEnvVar('USER_PASS'),
  host: getEnvVar('SERVER_HOST'),
  database: getEnvVar('DB'),
});