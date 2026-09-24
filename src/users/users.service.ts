import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  // NestJS nous donne automatiquement PrismaService (l'accès à la base)
  constructor(private prisma: PrismaService) {}

  // Crée un utilisateur
  async create(email: string, password: string, name?: string) {
    // On transforme le mot de passe en hash (10 = niveau de complexité)
    const hash = await bcrypt.hash(password, 10);

    // On enregistre le hash, jamais le mot de passe en clair
    return this.prisma.user.create({
      data: { email, password: hash, name },
    });
  }

  // Cherche un utilisateur par son email (servira pour le login)
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}