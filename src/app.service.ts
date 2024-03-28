import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from './schemas/link.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(data: Link): Promise<Link> {
    const short_url = new this.linkModel(data);
    return short_url.save();
  }

  generateShortUrl(length: number): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result: string = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}
