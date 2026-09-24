import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

// Les données attendues pour créer un compte
export class RegisterDto {
  @IsEmail() // doit être un email valide
  email!: string;

  @IsString()
  @MinLength(8) // mot de passe : 8 caractères minimum
  password!: string;

  @IsOptional() // le nom est facultatif
  @IsString()
  name?: string;
}