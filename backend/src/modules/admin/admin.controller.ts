import { Controller, Get, Patch, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get("stats")
  getStats() { return this.admin.getStats(); }

  @Patch("users/:id/ban")
  banUser(@Param("id") id: string) { return this.admin.banUser(id); }

  @Patch("users/:id/role")
  setRole(@Param("id") id: string, @Body() body: { role: string }) {
    return this.admin.setUserRole(id, body.role);
  }
}
