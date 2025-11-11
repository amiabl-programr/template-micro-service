import dotenv from 'dotenv';
dotenv.config();

export default {
PORT: Number(process.env.PORT) || 3000,
DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
NODE_ENV: process.env.NODE_ENV || 'development',
};