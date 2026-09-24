import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/user';

describe('user.generateAuthToken', () => {
  const originalKey = process.env.JWT_PRIVATE_KEY;

  beforeAll(() => {
    process.env.JWT_PRIVATE_KEY = 'test_private_key';
  });

  afterAll(() => {
    process.env.JWT_PRIVATE_KEY = originalKey;
  });

  it('should return a valid JWT with the user id in the payload', () => {
    const _id = new mongoose.Types.ObjectId();
    const user = new User({ _id, name: 'John', email: 'john@example.com', password: 'secret123' });

    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, 'test_private_key') as JwtPayload;

    expect(decoded._id).toBe(_id.toHexString());
  });

  it('should be signed with the private key from the environment', () => {
    const user = new User({ name: 'John', email: 'john@example.com', password: 'secret123' });

    const token = user.generateAuthToken();

    expect(() => jwt.verify(token, 'some_other_key')).toThrow();
  });

  it('should expire in 7 days', () => {
    const user = new User({ name: 'John', email: 'john@example.com', password: 'secret123' });

    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, 'test_private_key') as JwtPayload;

    expect(decoded.exp! - decoded.iat!).toBe(7 * 24 * 60 * 60);
  });

  it('should throw if JWT_PRIVATE_KEY is not defined', () => {
    delete process.env.JWT_PRIVATE_KEY;
    const user = new User({ name: 'John', email: 'john@example.com', password: 'secret123' });

    expect(() => user.generateAuthToken()).toThrow('JWT_PRIVATE_KEY is not defined');

    process.env.JWT_PRIVATE_KEY = 'test_private_key';
  });
});