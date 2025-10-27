import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  // Set a global prefix (optional but common)
  app.setGlobalPrefix('api');

  // Enable URI-based versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
  logger.verbose(
    'Application is running on port ' + (process.env.PORT ?? 5000),
  );
  logger.verbose(`Application is running in ${process.env.STAGE} mode`);
}
bootstrap();
