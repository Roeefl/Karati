const TIMEZONE = 'en-us';
const MONTH = 'long';
const YEAR = 'numeric';
const DAY = 'numeric';

export const formatDate = date => {
  return new Date(date).toLocaleString(TIMEZONE, {
    year: YEAR,
    month: MONTH,
    day: DAY
  });
};
