export const parseErrorResponse = (error: any): string | null => {
  if (error?.data?.msg) {
    return error.data.msg;
  }
  return null;
};

export const parseZodError = (error: any, path: string): string | null => {
  if (Array.isArray(error?.data)) {
    const message: string = error.data
      .filter((e: any) => e.path.includes(path))
      .map((e: any) => e.message)
      .join(', ');

    return message || null;
  }
  return null;
};
