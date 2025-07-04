import { DataSource } from 'typeorm';
import { Product } from '../entities/Product';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'nikesh',
  database: process.env.DB_NAME || 'ecommerce_admin',
  synchronize: true,
  logging: false,
  entities: [Product],
  migrations: [],
  subscribers: [],
});