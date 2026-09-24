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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ContactGroup } from '../generated/prisma/client.js';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

// Ce que JwtStrategy place dans req.user
interface AuthRequest {
  user: { userId: string; email: string };
}

// Toutes les routes ci-dessous commencent par /contacts
// et sont réservées aux utilisateurs connectés (le vigile)
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private contacts: ContactsService) {}

  // POST /contacts
  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateContactDto) {
    return this.contacts.create(req.user.userId, dto);
  }

  // GET /contacts?search=awa&group=AMI
  @Get()
  findAll(
    @Req() req: AuthRequest,
    @Query('search') search?: string,
    @Query('group', new ParseEnumPipe(ContactGroup, { optional: true }))
    group?: ContactGroup,
  ) {
    return this.contacts.findAll(req.user.userId, search, group);
  }

  // GET /contacts/:id
  @Get(':id')
  findOne(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.contacts.findOne(req.user.userId, id);
  }

  // PATCH /contacts/:id
  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contacts.update(req.user.userId, id, dto);
  }

  // DELETE /contacts/:id
  @Delete(':id')
  remove(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.contacts.remove(req.user.userId, id);
  }
}