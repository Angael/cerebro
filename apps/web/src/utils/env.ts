const verifyEnv = <T = string>(env: T | undefined): T => {
  if (!env) {
    throw new Error(`Missing env variable`);
  }
  return env;
};

export const NEXT_PUBLIC_API_URL = verifyEnv(process.env.NEXT_PUBLIC_API_URL);
