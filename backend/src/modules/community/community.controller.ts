import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CommunityService } from "./community.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("community")
@Controller("community")
export class CommunityController {
  constructor(private community: CommunityService) {}

  @Get("posts")
  getPosts(@Query() q: any) { return this.community.getPosts(q.page, q.limit); }

  @Post("posts")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createPost(@Body() body: any, @Req() req: any) { return this.community.createPost(req.user.id, body); }

  @Post("posts/:id/like")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  likePost(@Param("id") id: string, @Req() req: any) { return this.community.likePost(id, req.user.id); }
}
