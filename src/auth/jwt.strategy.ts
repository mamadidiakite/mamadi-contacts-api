import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from './jwt-secret.js';

// Cette classe explique à Passport comment vérifier un token JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Le token est lu dans l'en-tête : Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Un token expiré est refusé
      ignoreExpiration: false,
      // Le secret pour vérifier la signature du token
      secretOrKey: JWT_SECRET,
    });
  }

  // Appelée seulement si le token est valide.
  // Ce qu'on retourne sera disponible dans req.user
  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}