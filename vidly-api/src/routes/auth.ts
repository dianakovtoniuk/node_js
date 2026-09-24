import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, validateLogin } from '../models/user';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { error, value } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(value.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  res.send({ token: user.generateAuthToken() });
});

export default router;
