import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContactGroup } from '../../generated/prisma/client.js';

// Les données attendues pour créer un contact
export class CreateContactDto {
  @IsString()
  @IsNotEmpty() // obligatoire
  fullName!: string;

  @IsString()
  @IsNotEmpty() // obligatoire
  phone!: string;

  @IsOptional()
  @IsEmail() // si présent, doit être un email valide
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ContactGroup) // FAMILLE, AMI, TRAVAIL ou AUTRE
  group?: ContactGroup;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}