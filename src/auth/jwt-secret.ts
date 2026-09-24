// Charge le .env pour pouvoir lire JWT_SECRET
import 'dotenv/config';

const secret = process.env.JWT_SECRET;

// Si le secret est absent, on arrête tout de suite avec un message clair
if (!secret) {
  throw new Error('JWT_SECRET est manquant dans le fichier .env');
}

// Le secret utilisé pour signer et vérifier les tokens
export const JWT_SECRET: string = secret;