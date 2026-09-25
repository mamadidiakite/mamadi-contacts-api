import type { MulterFile } from '../common/photo-storage.js';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ContactGroup } from '../generated/prisma/client.js';
import { deletePhoto, savePhoto } from '../common/photo-storage.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateContactDto) {
    return this.prisma.contact.create({ data: { ...dto, userId } });
  }

  findAll(userId: string, search?: string, group?: ContactGroup) {
    return this.prisma.contact.findMany({
      where: {
        userId,
        ...(search && {
          fullName: { contains: search, mode: 'insensitive' as const },
        }),
        ...(group && { group }),
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, userId },
    });
    if (!contact) {
      throw new NotFoundException('Contact introuvable');
    }
    return contact;
  }

  async update(userId: string, id: string, dto: UpdateContactDto) {
    await this.findOne(userId, id);
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  async setPhoto(userId: string, id: string, file: MulterFile) {
    const contact = await this.findOne(userId, id);
    const photoUrl = await savePhoto(file);
    await deletePhoto(contact.photoUrl);
    return this.prisma.contact.update({ where: { id }, data: { photoUrl } });
  }

  async remove(userId: string, id: string) {
    const contact = await this.findOne(userId, id);
    await this.prisma.contact.delete({ where: { id } });
    await deletePhoto(contact.photoUrl);
    return contact;
  }
}