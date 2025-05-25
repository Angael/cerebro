import { z } from 'zod';

export type SignInErrorCode =
  | 'invalid_form_data'
  | 'invalid_credentials'
  | 'unknown_error'
  | 'email_taken';

export const zSignInForm = z.object({
  email: z.string().trim().min(3).email().trim(),
  password: z.string().trim().min(6, 'Password must be at least 6 characters long'),
  redirectTo: z.string().trim().optional().default('/'),
});
