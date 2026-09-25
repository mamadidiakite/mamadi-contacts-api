import type { MulterFile } from '../common/photo-storage.js';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ContactGroup } from '../generated/prisma/client.js';
import { PHOTO_MAX_SIZE, photoValidationPipe } from '../common/photo-storage.js';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

interface AuthRequest {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private contacts: ContactsService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateContactDto) {
    return this.contacts.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req: AuthRequest,
    @Query('search') search?: string,
    @Query('group', new ParseEnumPipe(ContactGroup, { optional: true }))
    group?: ContactGroup,
  ) {
    return this.contacts.findAll(req.user.userId, search, group);
  }

  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.contacts.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contacts.update(req.user.userId, id, dto);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: PHOTO_MAX_SIZE } }))
  uploadPhoto(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(photoValidationPipe()) file: MulterFile,
  ) {
    return this.contacts.setPhoto(req.user.userId, id, file);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.contacts.remove(req.user.userId, id);
  }
}