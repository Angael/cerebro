import * as dotenv from 'dotenv';
import path from 'node:path';

// TODO: Does this work??? Doesnt seem like it?
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
} else {
  // Rethink this else, maybe only use .env file, same for prod, because ci/cd will set env vars
  dotenv.config({ path: path.join(__dirname, './.env.' + process.env.NODE_ENV) });
}

console.log(process.env.DB_HOST);
console.log(process.env.DB_NAME);
