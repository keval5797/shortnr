import * as Joi from 'joi';

export const create_link = Joi.object({
  url: Joi.string().required(),
});
