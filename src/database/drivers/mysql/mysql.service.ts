import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { createPool, Pool } from 'mysql2/promise';
import databaseEnvConfig from 'src/database/database-env.config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MySQLDatabaseService
  extends DatabaseService<MySql2Database>
  implements OnModuleInit
{
  private pool!: Pool;
  private _db!: MySql2Database;

  constructor(
    @Inject(databaseEnvConfig.KEY)
    private readonly config: ConfigType<typeof databaseEnvConfig>,
  ) {
    super();
  }

  get db(): MySql2Database {
    return this._db;
  }

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    this.pool = createPool({
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      user: this.config.DB_USERNAME,
      password: this.config.DB_PASSWORD,
      database: this.config.DB_DATABASE,
    });

    this._db = drizzle(this.pool);

    const connection = await this.pool.getConnection();
    connection.release();
  }

  async close() {
    await this.pool.end();
  }
}
