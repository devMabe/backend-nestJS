import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('firebase-auth')
  .setDescription('Api de login, register using firebase with nestJS')
  .setVersion('1.0')
  .addTag('login')
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('documentation', app, document);


  await app.listen(3000);
}
bootstrap();
