import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';

const router = express.Router();

interface ICustomer {
  name: string;
  isGold: boolean;
  phone: string;
}

const Customer = mongoose.model<ICustomer>(
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

router.get('/', async (_req: Request, res: Response) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  }).save();

  res.send(customer);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

function validateCustomer(customer: unknown) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

export default router;
