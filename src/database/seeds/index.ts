import dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { AppModule } from 'src/app.module';
import { DatabaseService } from '../database.service';
import userSeeds from './users.seed';

async function run() {
  const app = await NestFactory.create(AppModule);
  const dbService = app.get(DatabaseService<MySql2Database>);
  await dbService.connect();

  await userSeeds(dbService.db);

  console.log('Database seeds executed.');
  process.exit(0);
}

run();
