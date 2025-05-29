import { format } from 'date-fns';

export const formatYYYYMMDD = (date: Date): string => format(date, 'yyyy-MM-dd');
