import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Module({
  providers: [UsersService], // crée le service
  exports: [UsersService],   // le module auth pourra l'utiliser plus tard
})
export class UsersModule {}