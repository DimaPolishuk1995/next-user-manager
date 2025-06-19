import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";
export class PaginationDto {
    @IsInt() @Min(1) @Type(() => Number) page = 1;
    @IsInt() @Min(1) @Type(() => Number) pageSize = 20;
    @IsOptional() sortBy?: keyof import("../interfaces/user.interface").User;
    @IsOptional() sortOrder?: "asc" | "desc";
}
