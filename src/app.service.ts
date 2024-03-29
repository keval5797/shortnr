import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Link } from './schemas/link.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}

  async create(data: Link): Promise<Link> {
    const short_url = new this.linkModel(data);
    return short_url.save();
  }

  async getByShortUrl(short_url: string): Promise<Link> {
    return await this.linkModel.findOne({ short_url });
  }

  generateShortUrl(length: number): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result: string = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  @Cron('0 10 * * *') //Every day at 10 am
  async deleteUrls() {
    try {
      const delete_links_data_before_days =
        +process.env.DELETE_LINKS_DATA_BEFORE_DAYS || 1;

      const threshold_date = new Date(
        new Date().setDate(
          new Date().getDate() - delete_links_data_before_days,
        ),
      );
      threshold_date.setHours(23, 59, 59);
      threshold_date.toISOString();

      const data = await this.linkModel.deleteMany({
        created_at: { $lt: threshold_date },
      });
    } catch (error) {
      throw error;
    }
  }
}
