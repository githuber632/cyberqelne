import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RankingsService } from "./rankings.service";

@ApiTags("rankings")
@Controller("rankings")
export class RankingsController {
  constructor(private rankings: RankingsService) {}

  @Get("players")
  getPlayers(@Query() q: any) { return this.rankings.getPlayerLeaderboard(q); }

  @Get("teams")
  getTeams(@Query() q: any) { return this.rankings.getTeamLeaderboard(q); }
}
