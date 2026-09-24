import express, { Request, Response } from 'express';
import { Rental, validateRental } from '../models/rental';
import { Movie } from '../models/movie';
import { Customer } from '../models/customer';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  const rental = await new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  }).save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

router.get('/:id', async (req: Request, res: Response) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

export default router;
