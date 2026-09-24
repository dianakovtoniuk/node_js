import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtKey } from '../config';

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = header.slice('Bearer '.length);

  try {
    res.locals.user = jwt.verify(token, getJwtKey());
    next();
  } catch {
    res.status(401).send('Invalid or expired token.');
  }
}
