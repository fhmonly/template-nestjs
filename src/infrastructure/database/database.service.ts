import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DatabaseService<TDatabase = unknown> {
  abstract get db(): TDatabase;

  abstract connect(): Promise<void>;

  abstract close(): Promise<void>;
}
