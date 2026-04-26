"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding CyberQELN database...");
    const adminHash = await bcrypt.hash("Admin123!", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@cyberqeln.com" },
        create: {
            email: "admin@cyberqeln.com",
            nickname: "CyberAdmin",
            passwordHash: adminHash,
            role: "ADMIN",
            country: "UZ",
            rating: 5000,
            playerStats: { create: {} },
        },
        update: {},
    });
    const teams = [
        { name: "Team Phantom", tag: "PH", country: "UZ", rating: 4200 },
        { name: "Shadow Force", tag: "SF", country: "KZ", rating: 4050 },
        { name: "Neon Wolves", tag: "NW", country: "UZ", rating: 3980 },
        { name: "Iron Legion", tag: "IL", country: "KG", rating: 3720 },
        { name: "CyberQELN Pro", tag: "CQ", country: "RU", rating: 3840 },
    ];
    for (const teamData of teams) {
        const teamOwner = await prisma.user.upsert({
            where: { email: `${teamData.tag.toLowerCase()}@cyberqeln.com` },
            create: {
                email: `${teamData.tag.toLowerCase()}@cyberqeln.com`,
                nickname: `${teamData.name.replace(" ", "")}Captain`,
                passwordHash: await bcrypt.hash("Demo123!", 12),
                country: teamData.country,
                rating: teamData.rating - 200,
                playerStats: { create: { wins: 120, losses: 40, winRate: 75, tournamentsWon: 3 } },
            },
            update: {},
        });
        await prisma.team.upsert({
            where: { name: teamData.name },
            create: {
                name: teamData.name,
                tag: teamData.tag,
                country: teamData.country,
                rating: teamData.rating,
                ownerId: teamOwner.id,
                members: {
                    create: { userId: teamOwner.id, role: "OWNER", position: "Jungler" },
                },
                teamStats: {
                    create: { wins: 48, losses: 12, winRate: 80, tournamentsWon: 3 },
                },
            },
            update: {},
        });
    }
    await prisma.tournament.upsert({
        where: { slug: "cyberqeln-championship-s2" },
        create: {
            title: "CyberQELN Championship S2",
            slug: "cyberqeln-championship-s2",
            description: "Главный турнир сезона с призовым фондом 50,000,000 UZS",
            game: "MLBB",
            status: "ACTIVE",
            format: "SINGLE_ELIMINATION",
            prizePool: BigInt(50_000_000),
            entryFee: BigInt(0),
            maxTeams: 16,
            featured: true,
            registrationStartAt: new Date("2026-04-01"),
            registrationEndAt: new Date("2026-04-14"),
            startDate: new Date("2026-04-15"),
            endDate: new Date("2026-04-25"),
        },
        update: {},
    });
    const products = [
        { name: "CyberQELN Hoodie", slug: "hoodie-cyber-black", price: BigInt(299_000), category: "MERCH_CLOTHING", featured: true },
        { name: "Cyber XL Mousepad", slug: "mousepad-xl", price: BigInt(189_000), category: "GAMING_PERIPHERAL", featured: true },
        { name: "Team Jersey 2026", slug: "jersey-team-2026", price: BigInt(249_000), category: "MERCH_CLOTHING" },
        { name: "1000 CyberCoins", slug: "cybercoins-1000", price: BigInt(49_000), category: "DIGITAL_CURRENCY", isDigital: true },
    ];
    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            create: { ...p, stock: -1 },
            update: {},
        });
    }
    console.log("✅ Database seeded successfully!");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map