import { IsString, IsNumber, IsOptional, IsDateString, Min } from "class-validator";

export class CreateTournamentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  game: string;

  @IsNumber()
  @Min(2)
  maxTeams: number;

  @IsNumber()
  prizePool: number;

  @IsNumber()
  @IsOptional()
  entryFee?: number;

  @IsDateString()
  registrationStartAt: string;

  @IsDateString()
  registrationEndAt: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  region?: string;
}
