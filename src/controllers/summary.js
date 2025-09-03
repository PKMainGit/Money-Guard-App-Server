// src/controllers/summary.js
import { getSummary } from '../services/summary.js'
import { parseSummaryFilterParams } from '../utils/parseFilterParams.js';

export const getSummaryController = async (req, res) => {
	try {
		const filter = parseSummaryFilterParams(req.query);

    const summary = await getSummary({userId: req.user._id, filter});
    res.status(200).json({
      status: 200,
      message: 'Successfully found transactions!',
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};
