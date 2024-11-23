import { Hono } from 'hono';
import { lucia } from '@/my-lucia';
import { Context } from 'hono';

type HonoVariables = { Variables: Awaited<ReturnType<typeof lucia.validateSession>> };
export type MyContext = Context<HonoVariables>;

export const honoFactory = () => new Hono<HonoVariables>();
