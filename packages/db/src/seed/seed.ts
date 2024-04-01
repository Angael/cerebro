// {
//       uid: 'Se561raFjoSjJY5Q7kZtwoIHk4H2',
//       email: 'user@user.com',
//       name: 'myUser',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       type: 'ADMIN',
//     }

import { db } from '../main.js';

const main = async () => {
  await db
    .insertInto('user')
    .values({
      id: 2137,
      email: 'user@user.com',
      hashed_password:
        // password: ???
        '$argon2id$v=19$m=4096,t=3,p=1$X2V1Zm9yZ2V0X3NlY3JldA$Q9g3Y9f3tJvR5J8b8z1RnQ',
      type: 'ADMIN',
      last_login_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    })
    .execute();
};

main();
