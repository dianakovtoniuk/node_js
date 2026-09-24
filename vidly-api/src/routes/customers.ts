import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { Customer, validateCustomer } from '../models/customer';

const router = express.Router();

router.use(auth);

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

export default router;
