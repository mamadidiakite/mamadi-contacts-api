// Charge le fichier .env avant tout le reste
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // NestExpressApplication donne accès aux fonctions d'Express (fichiers statiques)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Autorise le front (Next.js) à appeler cette API depuis le navigateur.
  app.enableCors({ origin: 'http://localhost:3001' });

  // Les fichiers du dossier "uploads" seront accessibles à l'adresse /uploads/...
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Vérifie automatiquement les données reçues avec les règles des DTOs.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();