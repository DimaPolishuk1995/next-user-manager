import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import "multer";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { PaginationDto } from "./dto/pagination.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ImportUserDto } from "./dto/import-users.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly users: UsersService) {}

    @Get()
    @ApiOperation({ summary: "Get paginated users" })
    @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
    @ApiQuery({ name: "pageSize", required: false, type: Number, example: 10 })
    @ApiQuery({ name: "sortBy", required: false, enum: ["id", "name", "email", "createdAt"] })
    @ApiQuery({ name: "sortOrder", required: false, enum: ["asc", "desc"], example: "asc" })
    @ApiResponse({
        status: 200,
        description: "Paged list of users",
        schema: {
            example: {
                data: [{ id: 1, name: "John", email: "john@example.com", createdAt: "2025-01-01T00:00:00Z" }],
                total: 15,
            },
        },
    })
    list(@Query() paged: PaginationDto) {
        return this.users.paged(paged);
    }

    @Post()
    @ApiOperation({ summary: "Create a user" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: "User created",
        schema: {
            example: { id: 16, name: "New", email: "new@example.com", createdAt: "2025-06-17T09:00:00Z" },
        },
    })
    create(@Body() body: CreateUserDto) {
        return this.users.create(body);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a user" })
    @ApiParam({ name: "id", type: Number, example: 3 })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: "User updated" })
    update(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.users.update(+id, body);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a user by id" })
    @ApiParam({ name: "id", type: Number, example: 3 })
    @ApiResponse({ status: 200, description: "User deleted" })
    remove(@Param("id") id: string) {
        return this.users.remove(+id);
    }

    @Post("import")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({ summary: "Import users from XLSX" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            required: ["file"],
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: "Users imported",
        schema: {
            example: { imported: 15 },
        },
    })
    async importXlsx(@UploadedFile() file: Express.Multer.File) {
        const wb = XLSX.read(file.buffer, { type: "buffer" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows: ImportUserDto = XLSX.utils
            .sheet_to_json<{ Name: string; Email: string; "Created At"?: string }>(sheet, { defval: "" })
            .map(({ Name: name, Email: email, "Created At": createdAt }) => ({
                name,
                email,
                createdAt: createdAt ? new Date(createdAt) : undefined,
            }));

        await this.users.bulkCreate(rows);
        return { imported: rows.length };
    }

    @Delete()
    @ApiOperation({ summary: "Delete ALL users" })
    @ApiResponse({
        status: 200,
        description: "All users deleted",
        schema: {
            example: { message: "all users deleted" },
        },
    })
    async removeAll() {
        await this.users.removeAll();
        return { message: "all users deleted" };
    }
}
