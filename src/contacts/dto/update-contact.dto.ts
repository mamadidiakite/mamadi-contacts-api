import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContactGroup } from '../../generated/prisma/client.js';

// Pour modifier un contact : tous les champs sont facultatifs,
// on envoie seulement ceux qu'on veut changer
export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ContactGroup)
  group?: ContactGroup;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}