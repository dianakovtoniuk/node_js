import mongoose, { Model } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { getJwtKey } from '../config';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

interface IUserMethods {
  generateAuthToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.method('generateAuthToken', function generateAuthToken(): string {
  return jwt.sign({ _id: this._id }, getJwtKey(), { expiresIn: '7d' });
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);

export function validateUser(user: unknown) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().lowercase().min(5).max(255).email().required(),
    // bcrypt only uses the first 72 bytes, so longer passwords make no sense
    password: Joi.string().min(5).max(72).required(),
  });

  return schema.validate(user);
}

export function validateLogin(credentials: unknown) {
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(72).required(),
  });

  return schema.validate(credentials);
}
