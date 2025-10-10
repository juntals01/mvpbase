import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load .env from root first, then local ones
      envFilePath: [
        resolve(process.cwd(), '../../.env.local'),
        resolve(process.cwd(), '../../.env'),
        resolve(process.cwd(), '.env.local'),
        resolve(process.cwd(), '.env'),
      ],
      validationSchema: Joi.object({
        API_PORT: Joi.number().port().default(8000),
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
