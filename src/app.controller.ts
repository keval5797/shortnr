import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Link } from './schemas/link.schema';
import { create_link } from './validation/validation';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('short_url')
  createShortUrl(@Body() data: { url: string }) {
    const validation = create_link.validate(data);
    if (validation.error)
      throw new BadRequestException(validation.error.details[0].message);
    const link_data: Link = <Link>{
      short_url: this.appService.generateShortUrl(7),
      url: data.url,
      created_at: new Date(),
    };
    return this.appService.create(link_data);
  }

  @Get(':short_url')
  async retriveFullUrl(
    @Param('short_url') short_url: string,
    @Res() res: Response,
  ) {
    const result = await this.appService.getByShortUrl(short_url);
    if (!result) throw new NotFoundException();

    const link_expires_in =
      (+process.env.LINK_EXPIRES_IN_MINS || 5) * 60 * 1000; // converting mins into miliseconds
    const link_expires_at = result.created_at.getTime() + link_expires_in;
    if (new Date().getTime() > link_expires_at)
      throw new BadRequestException('Link is expired');

    res.redirect(result.url);
  }
}
