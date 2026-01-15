import { IsString, IsNotEmpty, IsNumber, Min, IsIn } from 'class-validator';

export class CreateTimeEntryDto {
  @IsString()
  @IsNotEmpty()
  date: string; 

  @IsString()
  @IsNotEmpty()
  @IsIn(['Viso Internal', 'Client A', 'Client B', 'Personal Development']) 
  project: string;

  @IsNumber()
  @Min(0.1) 
  hours: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}