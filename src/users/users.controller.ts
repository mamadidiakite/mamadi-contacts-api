import type { MulterFile } from '../common/photo-storage.js';

import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PHOTO_MAX_SIZE, photoValidationPipe } from '../common/photo-storage.js';
import { UsersService } from './users.service.js';

interface AuthRequest {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: PHOTO_MAX_SIZE } }))
  uploadPhoto(
    @Req() req: AuthRequest,
    @UploadedFile(photoValidationPipe()) file: MulterFile,
  ) {
    return this.users.setPhoto(req.user.userId, file);
  }
}