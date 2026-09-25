// Le type d'un fichier reçu par multer : on ne garde que les champs utilisés
export interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

import {
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

// Taille maximale d'une photo : 2 Mo
export const PHOTO_MAX_SIZE = 2 * 1024 * 1024;

// Dossier où les photos sont rangées (à la racine du projet)
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Formats autorisés, et l'extension du fichier qui va avec
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

// Le "contrôleur de sécurité" : refuse tout ce qui n'est pas une vraie image JPG, PNG ou WEBP
export function photoValidationPipe() {
  return new ParseFilePipe({
    validators: [new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ })],
  });
}

// Enregistre la photo sur le disque sous un nom aléatoire
// et renvoie son adresse, par exemple "/uploads/3f2a....jpg"
export async function savePhoto(file: MulterFile): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = randomUUID() + (EXTENSIONS[file.mimetype] ?? '.jpg');
  await writeFile(join(UPLOAD_DIR, name), file.buffer);
  return `/uploads/${name}`;
}

// Supprime l'ancien fichier (quand on remplace une photo ou qu'on supprime un contact)
export async function deletePhoto(photoUrl?: string | null) {
  if (!photoUrl) return;
  try {
    await unlink(join(UPLOAD_DIR, basename(photoUrl)));
  } catch {
    // le fichier n'existe déjà plus : rien à faire
  }
}