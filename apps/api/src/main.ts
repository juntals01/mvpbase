import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.API_PORT) || 8000;
  await app.listen(port);

  console.log(
    `🚀 Server running on: http://localhost:${port} (${process.env.NODE_ENV})`,
  );
}
bootstrap();
