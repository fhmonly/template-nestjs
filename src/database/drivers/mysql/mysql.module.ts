import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseEnvConfig from 'src/database/database-env.config';
import { MySQLDatabaseService } from './mysql.service';

@Module({
  imports: [ConfigModule.forFeature(databaseEnvConfig)],
  providers: [MySQLDatabaseService],
  exports: [MySQLDatabaseService],
})
export class MySQLDatabaseModule {}
