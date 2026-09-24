import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Le "vigile" : à mettre sur une route pour la réserver aux utilisateurs connectés.
// Usage : @UseGuards(JwtAuthGuard)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Constructeur vide : on dit à NestJS que ce guard n'a besoin d'aucune dépendance.
  // Sans lui, NestJS cherche un objet interne de Passport qu'il ne trouve pas.
  constructor() {
    super();
  }
}