import { TournamentsService } from "./tournaments.service";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
export declare class TournamentsController {
    private tournaments;
    constructor(tournaments: TournamentsService);
    findAll(query: any): Promise<{
        data: {
            registeredTeams: number;
            totalMatches: number;
            registrations: {
                id: string;
            }[];
            _count: {
                registrations: number;
                matches: number;
            };
            id: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            title: string;
            game: string;
            banner: string | null;
            format: import(".prisma/client").$Enums.TournamentFormat;
            prizePool: bigint;
            entryFee: bigint;
            maxTeams: number;
            minTeams: number;
            teamSize: number;
            registrationStartAt: Date;
            registrationEndAt: Date;
            startDate: Date;
            endDate: Date;
            rules: string | null;
            organizerId: string | null;
            featured: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        registrations: ({
            team: {
                members: ({
                    user: {
                        id: string;
                        email: string;
                        nickname: string;
                        mlbbId: string | null;
                        passwordHash: string;
                        avatar: string | null;
                        bio: string | null;
                        country: string | null;
                        birthDate: Date | null;
                        role: import(".prisma/client").$Enums.UserRole;
                        status: import(".prisma/client").$Enums.UserStatus;
                        rating: number;
                        createdAt: Date;
                        updatedAt: Date;
                        lastSeenAt: Date | null;
                        mlbbServer: string | null;
                    };
                } & {
                    id: string;
                    role: import(".prisma/client").$Enums.TeamRole;
                    userId: string;
                    position: string | null;
                    joinedAt: Date;
                    teamId: string;
                })[];
            } & {
                id: string;
                country: string | null;
                status: import(".prisma/client").$Enums.TeamStatus;
                rating: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                tag: string;
                logo: string | null;
                description: string | null;
                ownerId: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.RegistrationStatus;
            userId: string;
            teamId: string;
            tournamentId: string;
            checkedIn: boolean;
            seed: number | null;
            registeredAt: Date;
        })[];
        brackets: ({
            matches: ({
                team1: {
                    id: string;
                    country: string | null;
                    status: import(".prisma/client").$Enums.TeamStatus;
                    rating: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    tag: string;
                    logo: string | null;
                    description: string | null;
                    ownerId: string;
                };
                team2: {
                    id: string;
                    country: string | null;
                    status: import(".prisma/client").$Enums.TeamStatus;
                    rating: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    tag: string;
                    logo: string | null;
                    description: string | null;
                    ownerId: string;
                };
                winner: {
                    id: string;
                    country: string | null;
                    status: import(".prisma/client").$Enums.TeamStatus;
                    rating: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    tag: string;
                    logo: string | null;
                    description: string | null;
                    ownerId: string;
                };
            } & {
                id: string;
                status: import(".prisma/client").$Enums.MatchStatus;
                tournamentId: string;
                bracketId: string | null;
                team1Id: string | null;
                team2Id: string | null;
                winnerId: string | null;
                score1: number | null;
                score2: number | null;
                scheduledAt: Date | null;
                startedAt: Date | null;
                finishedAt: Date | null;
                streamUrl: string | null;
                vodUrl: string | null;
                roundNumber: number;
                matchNumber: number;
            })[];
        } & {
            id: string;
            tournamentId: string;
            round: number;
            bracketType: string;
        })[];
        prizeDistribution: {
            id: string;
            teamId: string | null;
            tournamentId: string;
            place: number;
            amount: bigint;
            distributed: boolean;
            distributedAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        game: string;
        banner: string | null;
        format: import(".prisma/client").$Enums.TournamentFormat;
        prizePool: bigint;
        entryFee: bigint;
        maxTeams: number;
        minTeams: number;
        teamSize: number;
        registrationStartAt: Date;
        registrationEndAt: Date;
        startDate: Date;
        endDate: Date;
        rules: string | null;
        organizerId: string | null;
        featured: boolean;
    }>;
    create(dto: CreateTournamentDto, req: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        game: string;
        banner: string | null;
        format: import(".prisma/client").$Enums.TournamentFormat;
        prizePool: bigint;
        entryFee: bigint;
        maxTeams: number;
        minTeams: number;
        teamSize: number;
        registrationStartAt: Date;
        registrationEndAt: Date;
        startDate: Date;
        endDate: Date;
        rules: string | null;
        organizerId: string | null;
        featured: boolean;
    }>;
    register(id: string, body: any, req: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        userId: string;
        teamId: string;
        tournamentId: string;
        checkedIn: boolean;
        seed: number | null;
        registeredAt: Date;
    }>;
}
