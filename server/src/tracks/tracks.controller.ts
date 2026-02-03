import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Post(':id/rating')
  @HttpCode(HttpStatus.OK)
  addRating(@Param('id') id: string, @Body() body: { rating: number }) {
    const rating = Number(body?.rating);
    return this.tracksService.addRating(id, rating);
  }

  @Post(':id/time')
  @HttpCode(HttpStatus.OK)
  addTime(@Param('id') id: string, @Body() body: { time: number; by?: string }) {
    const time = Number(body?.time);
    return this.tracksService.addTime(id, time, body?.by);
  }
}
