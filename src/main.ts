import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Swagger } from './common/utils/swager';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://noghteh-khat.ir',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'production') {
    const swagger = new Swagger(app);
    swagger.buildDocument();
    await app.listen(5000);
  } else {
    await app.listen(7070, '0.0.0.0');
  }
}
bootstrap();
