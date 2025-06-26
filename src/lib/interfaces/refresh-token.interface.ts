import mongoose from 'mongoose';

export interface IRefreshToken {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
}
