import { Hono } from 'hono';
import { Context } from 'hono';

// Define a local User type for compatibility
export type User = {
  id: string;
  email: string;
  type: string;
};

type HonoVariables = { Variables: { user: User | null; session: any } };
export type MyContext = Context<HonoVariables>;

export const honoFactory = () => new Hono<HonoVariables>();
