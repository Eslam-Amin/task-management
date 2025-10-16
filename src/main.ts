import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set a global prefix (optional but common)
  app.setGlobalPrefix('api');

  // Enable URI-based versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
