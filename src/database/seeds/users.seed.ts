import bcrypt from 'bcrypt';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DatabaseService } from '../database.service';
import { users } from '../schemas/users.schema';

export default async function (db: DatabaseService<MySql2Database>['db']) {
  console.log('Seeding users...');
  const pw = await bcrypt.hash('admin', 10);

  await db.insert(users).values({
    email: 'admin@localhost.com',
    username: 'admin',
    password: pw,
  });

  return;
}
