// Charge le fichier .env avant tout le reste
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Vérifie automatiquement les données reçues avec les règles des DTOs.
  // whitelist: true supprime les champs qu'on n'a pas prévus.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();