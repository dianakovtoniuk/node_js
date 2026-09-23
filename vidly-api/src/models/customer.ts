import mongoose from 'mongoose';
import Joi from 'joi';

export interface ICustomer {
  name: string;
  isGold: boolean;
  phone: string;
}

export const Customer = mongoose.model<ICustomer>(
  'Customer',
  new mongoose.Schema<ICustomer>({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

export function validateCustomer(customer: unknown) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}
