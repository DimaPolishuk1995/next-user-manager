import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        skipDuplicates: true,
        data: [
            { id: 1, name: "John Doe", email: "john@example.com", createdAt: new Date("2023-01-01") },
            { id: 2, name: "Jane Smith", email: "jane@example.com", createdAt: new Date("2023-01-15") },
            { id: 3, name: "Bob Johnson", email: "bob@example.com", createdAt: new Date("2023-02-01") },
            { id: 4, name: "Alice Williams", email: "alice@example.com", createdAt: new Date("2023-02-15") },
            { id: 5, name: "Michael Brown", email: "michael@example.com", createdAt: new Date("2023-03-01") },
            { id: 6, name: "Emily Davis", email: "emily@example.com", createdAt: new Date("2023-03-15") },
            { id: 7, name: "David Wilson", email: "david@example.com", createdAt: new Date("2023-04-01") },
            { id: 8, name: "Laura Martin", email: "laura@example.com", createdAt: new Date("2023-04-15") },
            { id: 9, name: "James White", email: "james@example.com", createdAt: new Date("2023-05-01") },
            { id: 10, name: "Linda Thompson", email: "linda@example.com", createdAt: new Date("2023-05-15") },
            { id: 11, name: "Brian Garcia", email: "brian@example.com", createdAt: new Date("2023-06-01") },
            { id: 12, name: "Sarah Clark", email: "sarah@example.com", createdAt: new Date("2023-06-15") },
            { id: 13, name: "Daniel Lewis", email: "daniel@example.com", createdAt: new Date("2023-07-01") },
            { id: 14, name: "Karen Walker", email: "karen@example.com", createdAt: new Date("2023-07-15") },
            { id: 15, name: "Paul Hall", email: "paul@example.com", createdAt: new Date("2023-08-01") },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
