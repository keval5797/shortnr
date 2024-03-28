import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Link, LinkSchema } from './schemas/link.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('short')
  createShortUrl(@Body() data: { url: string }) {
    // TODO add validator
    const link_data: Link = <Link>{
      short_url: this.appService.generateShortUrl(7),
      url: data.url,
      created_at: new Date(),
    };
    return this.appService.create(link_data);
  }
}
