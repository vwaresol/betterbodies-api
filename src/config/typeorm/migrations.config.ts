import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
// import { config } from 'dotenv';

// config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: 'postgres',
  password: 'secret123',
  database: 'betterbodies_test',
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrationsTableName: 'migrations',
  migrations: ['src/database/migrations/*.ts'],
});

export default AppDataSource;
