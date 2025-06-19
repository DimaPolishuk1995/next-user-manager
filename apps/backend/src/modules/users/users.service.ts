import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PaginationDto } from "./dto/pagination.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ImportUserRowDto } from "./dto/import-users.dto";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async paged({ page, pageSize, sortBy = "id", sortOrder = "asc" }: PaginationDto) {
        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.user.count(),
        ]);
        return { data, total };
    }

    create(body: CreateUserDto) {
        return this.prisma.user.create({
            data: { ...body, createdAt: body.createdAt ?? new Date() },
        });
    }

    update(id: number, body: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: body as Prisma.UserUpdateInput,
        });
    }

    remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }

    async bulkCreate(rows: ImportUserRowDto[]) {
        const data: Prisma.UserCreateManyInput[] = rows.map((r) => ({
            name: r.name,
            email: r.email,
            createdAt: r.createdAt ?? new Date(),
        }));
        await this.prisma.user.createMany({ data, skipDuplicates: true });
    }

    async removeAll() {
        await this.prisma.user.deleteMany({});
    }
}
