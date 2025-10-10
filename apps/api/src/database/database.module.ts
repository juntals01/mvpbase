import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';

const CWD = process.cwd();
const ROOT = resolve(CWD, '../../');

function buildUrlFromEnv() {
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

@Module({
  imports: [
    // Global env loader (no Joi)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(ROOT, '.env.local'),
        resolve(ROOT, '.env'),
        resolve(CWD, '.env.local'),
        resolve(CWD, '.env'),
      ],
    }),

    // DB connection
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        url: buildUrlFromEnv(),
        autoLoadEntities: true,
        synchronize: false, // keep false when using migrations
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
  ],
})
export class DatabaseModule {}
