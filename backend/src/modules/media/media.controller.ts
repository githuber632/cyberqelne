import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MediaService } from "./media.service";

@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private media: MediaService) {}

  @Get("videos")
  getVideos(@Query() q: any) { return this.media.getVideos(q.page, q.limit, q.category); }

  @Get("videos/:id")
  getVideo(@Param("id") id: string) { return this.media.getVideo(id); }
}
