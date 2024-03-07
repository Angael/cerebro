import { UserJSON } from '@clerk/clerk-sdk-node';
import logger from '@/utils/log.js';
import { afterCreateUser } from '@/models/User.js';

export async function userCreated(data: UserJSON) {
  const { id, email_addresses } = data;

  const email: string = email_addresses.find((u) => u.email_address)?.email_address ?? 'missing'; // This will probably bite me in the

  try {
    await afterCreateUser(id, email);

    return;
  } catch (e) {
    logger.error('Failed to add account %s', id);
    console.log(e);
    throw new Error(e as any);
  }
}
