import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerCss } from './swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Class Varlidator initialization
  app.useGlobalPipes(new ValidationPipe());

  // Swagger initialization
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, { customCss: swaggerCss });

  //Server initialization on PORT
  await app.listen(PORT);
  console.log(`CONNECTED TO DB AND SERVER STARTED ON PORT - ${PORT}`);
}
bootstrap();
