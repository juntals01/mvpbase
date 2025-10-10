// apps/api/src/database/data-source.ts
import { DataSource } from 'typeorm';
import { getDbUrl } from './env';

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: getDbUrl(),
  ssl: false,
  logging: !isProd,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false,
});
