import { User } from '../routes/honoFactory';

export const isUserOrAdmin = (user: User, userId: string) => {
  if (user.type === 'ADMIN') {
    return true;
  }

  return user.id === userId;
};
