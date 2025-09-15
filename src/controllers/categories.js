import { getCategories } from '../services/categories.js';

export const getCategoriesController = async (req, res) => {
  const data = await getCategories();

  res.status(200).json({
    status: 200,
    message: 'Successfully found categories ',
    data: data,
  });
};
