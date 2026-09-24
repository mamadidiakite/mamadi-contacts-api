import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

// Toutes les routes de ce contrôleur commencent par /auth
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // POST /auth/register : créer un compte
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  // POST /auth/login : se connecter et recevoir un token
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // GET /auth/me : route de test, réservée aux utilisateurs connectés
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { userId: string; email: string } }) {
    return req.user;
  }
}