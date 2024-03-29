import { SessionClaims } from '../declare-extensions.js';
import { UserType } from '@cerebro/db';
import { prisma } from '../db/db.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

// This class exists, because publicMetadata
export async function afterCreateUser(id: string, email: string) {
  const prismaUserData = {
    uid: id,
    email,
    type: UserType.FREE,
  };

  return Promise.all([
    clerkClient.users.updateUser(id, {
      publicMetadata: {
        roles: [UserType.PREMIUM],
      } satisfies SessionClaims,
    }),
    prisma.user.upsert({
      create: prismaUserData,
      update: prismaUserData,
      where: { uid: id },
    }),
  ]);
}
