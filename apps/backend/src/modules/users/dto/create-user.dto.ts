import { IsDate, IsEmail, IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
export class CreateUserDto {
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsEmail()
    @MaxLength(120)
    email!: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (value instanceof Date) return value;

        if (typeof value === "string") {
            const iso = value.length === 10 ? `${value}T00:00:00.000Z` : value;
            const d = new Date(iso);
            if (!Number.isNaN(d.getTime())) return d;
        }
        return value;
    })
    @IsDate()
    createdAt?: Date;
}
