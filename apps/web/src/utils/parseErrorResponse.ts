export type ErrorFromApi = {
  general: string | undefined;
  fields: Record<string, string | undefined>;
};

export const parseErrorResponse = (error: any): ErrorFromApi | null => {
  let general: string | undefined = error?.data?.msg ?? error?.data?.message;
  let fields: Record<string, string> = {};

  if (!general) {
    general = error?.message;
  }

  if (Array.isArray(error?.data)) {
    for (const field of error.data) {
      fields[field.path] += fields[field.path] ? `, ${field.message}` : field.message;
    }
  }

  if (!general && !Object.keys(fields).length) {
    return null;
  }

  return { general, fields };
};
