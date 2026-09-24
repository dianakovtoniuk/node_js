import mongoose from 'mongoose';
import Joi from 'joi';

export interface IGenre {
  name: string;
}

export const genreSchema = new mongoose.Schema<IGenre>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

export const Genre = mongoose.model<IGenre>('Genre', genreSchema);

export function validateGenre(genre: unknown) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}
