import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "player@gmail.com" })
  @IsEmail({}, { message: "Введите корректный email" })
  email: string;

  @ApiProperty({ example: "PhantomX" })
  @IsString()
  @MinLength(3, { message: "Минимум 3 символа" })
  @MaxLength(24, { message: "Максимум 24 символа" })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: "Только латинские буквы, цифры, _ и -" })
  nickname: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @MinLength(8, { message: "Минимум 8 символов" })
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Пароль должен содержать строчные, заглавные буквы и цифры",
  })
  password: string;

  @ApiProperty({ example: "UZ", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string;
}
