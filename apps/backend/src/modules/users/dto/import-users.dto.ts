import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class ImportUserRowDto {
    @IsNotEmpty() @MaxLength(100) name!: string;
    @IsEmail() @MaxLength(120) email!: string;
    createdAt?: Date;
}

export type ImportUserDto = ImportUserRowDto[];
