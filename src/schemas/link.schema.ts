import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Link {
  @Prop()
  short_url: string;

  @Prop()
  url: string;

  @Prop()
  created_at: Date;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
