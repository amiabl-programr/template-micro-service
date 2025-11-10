import dotenv from 'dotenv';
dotenv.config();

export default {
PORT: Number(process.env.PORT) || 3000,
DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
NODE_ENV: process.env.NODE_ENV || 'development',
};