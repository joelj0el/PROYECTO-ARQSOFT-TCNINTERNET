import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/SNACKSOFT',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '86400', // 24 horas en segundos
  nodeEnv: process.env.NODE_ENV || 'development'
};
