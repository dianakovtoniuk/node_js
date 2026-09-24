import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import genres from './routes/genres';
import customers from './routes/customers';
import movies from './routes/movies';
import rentals from './routes/rentals';
import users from './routes/users';
import auth from './routes/auth';
import { getJwtKey } from './config';

dotenv.config({ quiet: true });

try {
  getJwtKey();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

const app = express();

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
