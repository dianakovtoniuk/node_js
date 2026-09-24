import { describe, it, expect, beforeAll, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import genresRouter from '../routes/genres';
import { Genre } from '../models/genre';

jest.mock('../models/genre', () => {
  const actual = jest.requireActual('../models/genre');

  const MockGenre: any = jest.fn().mockImplementation(function (this: any, doc: any) {
    Object.assign(this, doc);
    this.save = jest.fn().mockResolvedValue({ _id: 'newGenreId', ...doc });
  });
  MockGenre.find = jest.fn();
  MockGenre.findById = jest.fn();
  MockGenre.findByIdAndUpdate = jest.fn();
  MockGenre.findByIdAndDelete = jest.fn();

  return { ...actual, Genre: MockGenre };
});

const app = express();
app.use(express.json());
app.use('/api/genres', genresRouter);

const JWT_PRIVATE_KEY = 'test_private_key';
const token = jwt.sign({ _id: new mongoose.Types.ObjectId().toHexString() }, JWT_PRIVATE_KEY);

beforeAll(() => {
  process.env.JWT_PRIVATE_KEY = JWT_PRIVATE_KEY;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/genres', () => {
  it('should return 200 and the list of genres', async () => {
    const genres = [{ name: 'Action' }, { name: 'Comedy' }];
    (Genre.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(genres) });

    const res = await request(app).get('/api/genres');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(genres);
  });
});

describe('GET /api/genres/:id', () => {
  it('should return 200 and the genre if it exists', async () => {
    const genre = { _id: '1', name: 'Action' };
    (Genre.findById as jest.Mock).mockResolvedValue(genre);

    const res = await request(app).get('/api/genres/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(genre);
  });

  it('should return 404 if the genre with the given id does not exist', async () => {
    (Genre.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/genres/1');

    expect(res.status).toBe(404);
  });
});

describe('POST /api/genres', () => {
  it('should return 401 if the client is not logged in', async () => {
    const res = await request(app).post('/api/genres').send({ name: 'Action' });

    expect(res.status).toBe(401);
  });

  it('should return 401 if the token is invalid', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', 'Bearer invalidtoken')
      .send({ name: 'Action' });

    expect(res.status).toBe(401);
  });

  it('should return 400 if the genre name is shorter than 3 characters', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ac' });

    expect(res.status).toBe(400);
  });

  it('should return 400 if the genre name is missing', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should save and return 200 with the genre if it is valid', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Action' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', 'newGenreId');
    expect(res.body).toHaveProperty('name', 'Action');
  });
});

describe('PUT /api/genres/:id', () => {
  it('should return 401 if the client is not logged in', async () => {
    const res = await request(app).put('/api/genres/1').send({ name: 'Action' });

    expect(res.status).toBe(401);
  });

  it('should return 400 if the genre name is invalid', async () => {
    const res = await request(app)
      .put('/api/genres/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ac' });

    expect(res.status).toBe(400);
  });

  it('should return 404 if the genre with the given id does not exist', async () => {
    (Genre.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put('/api/genres/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Action' });

    expect(res.status).toBe(404);
  });

  it('should return 200 and the updated genre if it exists', async () => {
    const updatedGenre = { _id: '1', name: 'Action' };
    (Genre.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedGenre);

    const res = await request(app)
      .put('/api/genres/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Action' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedGenre);
  });
});

describe('DELETE /api/genres/:id', () => {
  it('should return 401 if the client is not logged in', async () => {
    const res = await request(app).delete('/api/genres/1');

    expect(res.status).toBe(401);
  });

  it('should return 404 if the genre with the given id does not exist', async () => {
    (Genre.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/genres/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 200 and the deleted genre if it exists', async () => {
    const deletedGenre = { _id: '1', name: 'Action' };
    (Genre.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedGenre);

    const res = await request(app)
      .delete('/api/genres/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(deletedGenre);
  });
});
