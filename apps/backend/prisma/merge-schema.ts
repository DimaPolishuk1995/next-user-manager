import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const root = __dirname;
const parts = [
    join(root, "schema/datasource.prisma"),
    join(root, "schema/generator.prisma"),
    ...readdirSync(join(root, "schema/models"))
        .filter((f) => f.endsWith(".prisma"))
        .map((f) => join(root, "schema/models", f)),
];

const merged = parts.map((p) => readFileSync(p, "utf8")).join("\n\n");
const out = join(root, "schema.prisma");

writeFileSync(out, merged);
