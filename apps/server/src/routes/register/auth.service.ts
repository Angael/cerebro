import { userTypeCache } from '@/cache/userCache.js';

export async function registerUser(uid: string, email: string) {
  throw new Error('not implemented');
  try {
    prisma.user.create({
      data: {
        uid,
        email,
        type: UserType.FREE,
      },
    });
    userTypeCache.del(uid);
    return;
  } catch {
    throw new Error('Failed to add this account');
  }
}
