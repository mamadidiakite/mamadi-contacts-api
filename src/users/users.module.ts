import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  providers: [UsersService], // crée le service
  exports: [UsersService], controllers: [UsersController],   // le module auth pourra l'utiliser plus tard
})
export class UsersModule {}