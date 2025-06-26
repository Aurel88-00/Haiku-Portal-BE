import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsMongoId,
} from 'class-validator';

export class AuthorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsNumber()
  @Min(1500)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsNumber()
  @Min(1500)
  @Max(new Date().getFullYear())
  deathYear?: number;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  era?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  haikus?: string[];
}
