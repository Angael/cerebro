import * as dotenv from 'dotenv';

// TODO: Does this work??? Doesnt seem like it?
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './.env' });
} else {
  dotenv.config({ path: './.env.' + process.env.NODE_ENV });
}
