// Le type d'un fichier reçu par multer : on ne garde que les champs utilisés
import type { MulterFile } from '../common/photo-storage.js';

import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { deletePhoto, savePhoto } from '../common/photo-storage.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string, name?: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hash, name },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async setPhoto(userId: string, file: MulterFile)  {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    const photoUrl = await savePhoto(file);
    await deletePhoto(user.photoUrl);

    return this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl },
      select: { id: true, email: true, name: true, photoUrl: true },
    });
  }
}