import mongoose from 'mongoose';
import Joi from 'joi';
import { IGenre, genreSchema } from './genre';

export interface IMovie {
  title: string;
  genre: IGenre;
  numberInStock: number;
  dailyRentalRate: number;
}

export const Movie = mongoose.model<IMovie>(
  'Movies',
  new mongoose.Schema<IMovie>({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

export function validateMovie(movie: unknown) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}
