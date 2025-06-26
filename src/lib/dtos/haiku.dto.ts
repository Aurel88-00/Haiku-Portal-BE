import {
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  Min,
  Max,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class HaikuDto {
  @IsString()
  title: string;

  @IsMongoId()
  author: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  lines: string[];

  @IsOptional()
  @IsString()
  originalLanguage?: string;

  @IsNumber()
  @Min(1500)
  @Max(new Date().getFullYear())
  yearWritten: number;
}
