import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { setupOpenApiDoc } from '~/open-api.config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '3' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  app.use(morgan('combined'));

  app.use(helmet());

  // TODO: swagger docs url should contain the api version eg v3/docs instead of /docs
  setupOpenApiDoc(app);

  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
