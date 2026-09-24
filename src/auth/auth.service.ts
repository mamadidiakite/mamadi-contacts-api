import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService, // pour chercher / créer des utilisateurs
    private jwt: JwtService, // pour fabriquer les tokens
  ) {}

  // Inscription
  async register(dto: RegisterDto) {
    // Si l'email existe déjà, on refuse
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // On crée l'utilisateur (le mot de passe est hashé dans UsersService)
    const user = await this.users.create(dto.email, dto.password, dto.name);

    // On renvoie seulement des infos sûres : jamais le mot de passe
    return { id: user.id, email: user.email, name: user.name };
  }

  // Connexion
  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);

    // On compare le mot de passe saisi avec le hash enregistré
    const passwordOk =
      user !== null && (await bcrypt.compare(dto.password, user.password));

    // Même message dans les deux cas, pour ne pas révéler si l'email existe
    if (!user || !passwordOk) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // On fabrique le token : sub = l'id de l'utilisateur
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}