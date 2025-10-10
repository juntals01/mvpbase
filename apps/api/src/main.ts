// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow your web app origin (adjust if needed)
  const webUrl = process.env.WEB_URL || 'http://localhost:3003';
  app.enableCors({
    origin: [webUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  const port = Number(process.env.API_PORT) || 8000;
  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`✅ CORS allowed origin: ${webUrl}`);
}

bootstrap();
