import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, validateUser } from '../models/user';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/me', auth, async (_req: Request, res: Response) => {
  const user = await User.findById(res.locals.user._id).select('-password');
  if (!user) return res.status(404).send('User not found.');

  res.send(user);
});

router.post('/', async (req: Request, res: Response) => {
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existing = await User.findOne({ email: value.email });
  if (existing) return res.status(400).send('User already registered.');

  const salt = await bcrypt.genSalt(10);
  const user = await new User({
    name: value.name,
    email: value.email,
    password: await bcrypt.hash(value.password, salt),
  }).save();

  const token = user.generateAuthToken();

  res.status(201).send({
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
});

export default router;
