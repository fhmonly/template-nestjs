import dotenv from 'dotenv';
import { Config, defineConfig } from 'drizzle-kit';
import 'reflect-metadata';
import { DatabaseEnvSchema } from 'src/infrastructure/database/database-env.schema';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
dotenv.config();

const credentials = validateObjectUsingClass(DatabaseEnvSchema, process.env);

let mysqlConfig: Config = {
  out: './drizzle',
  schema: './src/infrastructure/database/schemas/**/*.schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    host: credentials.DB_HOST,
    port: credentials.DB_PORT,
    user: credentials.DB_USERNAME,
    database: credentials.DB_DATABASE,
  },
};

if (!!credentials.DB_PASSWORD)
  Object.assign(mysqlConfig.dbCredentials, {
    password: credentials.DB_PASSWORD,
  } as (typeof mysqlConfig)['dbCredentials']);

export default defineConfig(mysqlConfig);
