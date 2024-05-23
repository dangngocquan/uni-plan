import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { get } from 'http';
import { createWriteStream } from 'fs';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [''],
  });

  // CORS
  // const allowedOrigins = ['http://localhost:3000'];
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    // credentials: true,
  };
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  app.enableCors(corsOptions);

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
    }),
  );

  const port = process.env.PORT;
  await app.listen(port);
  console.info(`Running on port ${port}`);
  console.info(
    `Documentation: http://localhost:${process.env.PORT}/documentation`,
  );

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
    const serverUrl = await app.getUrl();
    // write swagger ui files
    get(`${serverUrl}/documentation/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/documentation/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/documentation/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/documentation/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}
bootstrap();
