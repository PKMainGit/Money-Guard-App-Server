import { pool } from "./dbConnect.js";

const tables = [
  {
    name: 'users',
    query: `
			CREATE TABLE users (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				email TEXT NOT NULL,
				password TEXT NOT NULL,
				balance NUMERIC(18,2),
				avatar TEXT
			)
		`,
  },
  {
    name: 'sessions',
    query: `
			CREATE TABLE sessions (
				id SERIAL PRIMARY KEY,
				user_id INT REFERENCES users(id) ON DELETE CASCADE,
				access_token TEXT UNIQUE NOT NULL,
				refresh_token TEXT UNIQUE NOT NULL,
				access_token_valid_until TIMESTAMP NOT NULL,
				refresh_token_valid_until TIMESTAMP NOT NULL,
				created_at TIMESTAMP DEFAULT NOW(),
				updated_at TIMESTAMP NOT NULL
			)
		`,
  },
  {
    name: 'transactions',
    query: `
			CREATE TABLE transactions (
				id SERIAL PRIMARY KEY,
				date TIMESTAMP NOT NULL,
				type TEXT NOT NULL,
				category TEXT NOT NULL,
				sum NUMERIC(18,2),
				user_id INT REFERENCES users(id) ON DELETE CASCADE,
				created_at TIMESTAMP DEFAULT NOW(),
				updated_at TIMESTAMP NOT NULL
			)
		`,
  },
  {
    name: 'transaction_files',
    query: `
			CREATE TABLE transaction_files (
				id SERIAL PRIMARY KEY,
				transaction_id INT REFERENCES transactions(id) ON DELETE CASCADE,
				filename TEXT NOT NULL,
				path TEXT NOT NULL,
				mime_type TEXT,
				size BIGINT,
				uploaded_at TIMESTAMP DEFAULT NOW()
			)
		`,
  },
];

export async function createTables() {
	try {
		const res = await pool.query(`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = 'public'
			`);
		
		const existingTables = res.rows.map(row => row.table_name);
		const created = [];
		for (const table of tables) {
			if (!existingTables.includes(table.name)) {
				await pool.query(table.query);
				created.push(table.name);
			}
		}
		if (created.length > 0) {
			console.log('Created tables: ', created.join(', '));
		} else {
			console.log('All required tables already exist');
		}
		
	} catch (err) {
		console.log('Error creating tables: ', err);
	}
}

createTables();