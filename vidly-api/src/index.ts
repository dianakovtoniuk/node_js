import express from 'express';
import mongoose from 'mongoose';
import genres from './routes/genres';

const app = express();

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
