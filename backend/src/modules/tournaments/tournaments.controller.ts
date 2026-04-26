import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { TournamentsService } from "./tournaments.service";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("tournaments")
@Controller("tournaments")
export class TournamentsController {
  constructor(private tournaments: TournamentsService) {}

  @Get()
  findAll(@Query() query: any) { return this.tournaments.findAll(query); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.tournaments.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateTournamentDto, @Req() req: any) {
    return this.tournaments.create(dto, req.user.id);
  }

  @Post(":id/register")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  register(@Param("id") id: string, @Body() body: any, @Req() req: any) {
    return this.tournaments.registerTeam(id, body.teamId, req.user.id);
  }
}
