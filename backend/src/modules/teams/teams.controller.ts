import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { TeamsService } from "./teams.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private teams: TeamsService) {}

  @Get()
  findAll(@Query() q: any) { return this.teams.findAll(q.page, q.limit, q.country); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.teams.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() body: any, @Req() req: any) { return this.teams.create(body, req.user.id); }

  @Post(":id/invite")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  invite(@Param("id") id: string, @Body() body: any, @Req() req: any) {
    return this.teams.inviteMember(id, body.userId, req.user.id);
  }
}
