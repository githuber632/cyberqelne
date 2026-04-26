import { Controller, Get, Param, Patch, Body, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  findAll() { return this.users.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.users.findOne(id); }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.users.updateProfile(req.user.id, body);
  }
}
