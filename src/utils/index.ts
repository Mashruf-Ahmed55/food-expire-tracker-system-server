import { formatISO, parseISO, set } from 'date-fns';

export const parseDateToISOString = (data: string) => {
  const parseData = parseISO(data);
  const nowDate = new Date();

  const createData = set(parseData, {
    hours: nowDate.getHours(),
    minutes: nowDate.getMinutes(),
    seconds: nowDate.getSeconds(),
    milliseconds: nowDate.getMilliseconds(),
  });
  return formatISO(createData);
};
