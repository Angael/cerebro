import { useForm } from '@mantine/form';

export const useStoryPartForm = (usedNames: string[]) =>
  useForm({
    initialValues: { name: '' },

    validate: {
      name: (value) => {
        if (value.length < 1) return 'Name must be at least 1 character';
        if (usedNames.some((usedName) => usedName.toLowerCase() === value.toLowerCase())) {
          return 'Already used';
        }
      },
    },
    transformValues: (values) => {
      return { name: values.name.trim() };
    },
  });
