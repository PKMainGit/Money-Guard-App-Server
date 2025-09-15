// src/controllers/summary.js
import { getSummary } from '../services/summary.js';

export const getSummaryController = async (req, res) => {
	try {
		console.log('--- getSummaryController called ---');
    console.log('Query params:', req.query);
    console.log('User ID:', req.user?.id);
    const { date, type } = req.query;

    const filter = {};

    if (date) {
			const [month, year] = date.split('-').map(Number);
			if (!month || !year) {
        console.error('Invalid date format:', date);
      }
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      filter.startDate = startDate.toISOString().split('T')[0];
      filter.endDate = endDate.toISOString().split('T')[0];
    }

    if (type) {
      filter.type = type;
    }

		console.log('Filter applied:', filter);

    const summary = await getSummary({ userId: req.user.id, filter });
		console.log('Summary result:', summary);
    res.status(200).json({
      status: 200,
      message: 'Successfully found transactions!',
      data: summary,
    });
	} catch (error) {
		console.error('Error in getSummaryController:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};
