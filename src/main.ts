import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import compression from 'compression';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import { AppModule } from './app/app.module';

const main = async () => {
  const logger = new Logger('main', { timestamp: true });
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: 'http://localhost:5000', // Replace with your allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Displaying the request info
  // app.use(morgan('dev'));

  // Compressing the response body
  // app.use(compression());

  // Securing the API
  // app.use(helmet());

  await app.listen(8000).then(() => {
    logger.log(`Server up and running on port ${8000}`);
  });
};

main();
