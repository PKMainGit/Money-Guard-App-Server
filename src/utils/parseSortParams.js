// src/utils/parseSortParams.js

import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfContact = ['date', 'type', 'category', 'comment', 'sum'];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  return {
    sortOrder: parseSortOrder(sortOrder),
    sortBy: parseSortBy(sortBy),
  };
};
