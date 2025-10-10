import { resolve } from 'path';

// Load env in the same order everywhere (no Joi)
const CWD = process.cwd();
const ROOT = resolve(CWD, '../../');

export function loadEnv() {
  // load in order: root .env.local → root .env → app .env.local → app .env
  // later calls do not override existing keys
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: resolve(ROOT, '.env.local') });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: resolve(ROOT, '.env') });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: resolve(CWD, '.env.local') });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: resolve(CWD, '.env') });
}

export function getDbUrl() {
  loadEnv();

  const {
    DATABASE_URL,
    POSTGRES_HOST = 'localhost',
    POSTGRES_PORT = '5433',
    POSTGRES_USER = 'postgres',
    POSTGRES_PASSWORD = 'postgres',
    POSTGRES_DB = 'postgres',
  } = process.env;

  return (
    DATABASE_URL ??
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
  );
}
