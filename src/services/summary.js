// src/services/summary.js
import { pool } from '../db/dbConnect.js';

export const getSummary = async ({ userId, filter }) => {
  try {
    console.log('--- getSummary called ---');
    console.log('User ID:', userId);
    console.log('Filter:', filter);

    const values = [userId];
    let whereClause = 'WHERE user_id = $1';
    let counter = 2;

    if (filter.startDate) {
      whereClause += ` AND date >= $${counter++}`;
      values.push(filter.startDate);
    }
    if (filter.endDate) {
      whereClause += ` AND date <= $${counter++}`;
      values.push(filter.endDate);
    }
    if (filter.type) {
      whereClause += ` AND type = $${counter++}`;
      values.push(filter.type);
    }

    const query = `
      SELECT category, SUM(sum) AS total
      FROM transactions
      ${whereClause}
      GROUP BY category
      ORDER BY category;
    `;

    console.log('SQL Query:', query);
    console.log('Query Values:', values);

    const result = await pool.query(query, values);

    console.log('Query result:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error in getSummary service:', error);
    throw error;
  }
};
