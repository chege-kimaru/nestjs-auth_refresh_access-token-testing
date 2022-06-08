import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { setupOpenApiDoc } from '~/open-api.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(morgan('combined'));

  app.use(helmet());

  setupOpenApiDoc(app);

  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
