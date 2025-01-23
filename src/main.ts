import { v4 as uuidv4 } from 'uuid';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { env } from './config';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const setMiddleware = (app: NestExpressApplication) => {
  app.use(helmet());

  app.enableCors({
    credentials: true,
    origin: (_, callback) => callback(null, true),
    allowedHeaders: [
      '*',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Wallet-Address',
      'wallet-address',
    ],
  });

  app.use(morgan('combined'));

  app.use(compression());

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger('[]'),
  });
  app.useLogger(new Logger('APP'));
  const logger = new Logger('APP');

  app.setGlobalPrefix('api');
  setMiddleware(app);

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('FUN API')
      .setVersion('0.0.12')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, swaggerDocument, {
      jsonDocumentUrl: 'swagger/json',
    });
  }

  await app.listen(env.port, () =>
    logger.warn(`> Listening App on port ${env.port}`),
  );
}

bootstrap();
