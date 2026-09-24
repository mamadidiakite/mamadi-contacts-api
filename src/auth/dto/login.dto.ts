import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Les données attendues pour se connecter
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty() // le mot de passe ne peut pas être vide
  password!: string;
}