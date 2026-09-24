import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ContactGroup } from '../generated/prisma/client.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // Créer un contact : le userId vient du token, pas du client
  create(userId: string, dto: CreateContactDto) {
    return this.prisma.contact.create({ data: { ...dto, userId } });
  }

  // Lister MES contacts, avec recherche par nom et filtre par groupe (facultatifs)
  findAll(userId: string, search?: string, group?: ContactGroup) {
    return this.prisma.contact.findMany({
      where: {
        userId, // seulement les contacts de cet utilisateur
        // si "search" est fourni : nom qui contient le texte (sans tenir compte des majuscules)
        ...(search && {
          fullName: { contains: search, mode: 'insensitive' as const },
        }),
        // si "group" est fourni : seulement ce groupe
        ...(group && { group }),
      },
      orderBy: { fullName: 'asc' }, // tri par nom
    });
  }

  // Récupérer UN contact, seulement s'il appartient à cet utilisateur
  async findOne(userId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, userId },
    });
    // Contact inexistant OU appartenant à quelqu'un d'autre : même réponse 404
    if (!contact) {
      throw new NotFoundException('Contact introuvable');
    }
    return contact;
  }

  // Modifier un contact
  async update(userId: string, id: string, dto: UpdateContactDto) {
    await this.findOne(userId, id); // vérifie qu'il existe et qu'il est à moi
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  // Supprimer un contact
  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // même vérification
    return this.prisma.contact.delete({ where: { id } });
  }
}