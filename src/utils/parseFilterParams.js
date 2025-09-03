const parseDate = (date) => {
  if (typeof date !== 'string') return undefined;

  const [day, month, year] = date.split('-');
  if (!day || !month || !year) return undefined;

  return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
};

export const parseFilterParams = (query) => {
  const { date } = query;

  const parsedDate = parseDate(date);

  return {
    ...(parsedDate && { date: parsedDate }),
  };
};

const parseSummaryDate = (date) => {
  if (typeof date !== 'string') return undefined;

  const [month, year] = date.split('-');
  if (!month || !year) return undefined;

  return { month, year };
};

export const parseSummaryFilterParams = (query) => {
  const { date } = query;

  const parsedDate = parseSummaryDate(date);

  return parsedDate
    ? {
        date: {
          $regex: `^\\d{2}-${parsedDate.month.padStart(2, '0')}-${
            parsedDate.year
          }`,
        },
      }
    : {};
};
