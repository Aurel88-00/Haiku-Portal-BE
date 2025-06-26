import * as crypto from 'crypto';

export const generateString = (digits: number): string =>
  crypto.randomBytes(digits).toString('hex');
