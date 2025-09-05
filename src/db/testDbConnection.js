import { pool } from "./dbConnect.js";

export async function testConnection() {
	try {
		pool.query("SELECT NOW()", (err, res) => {
			if (err) {
				console.log('Connection error : ', err)
			} else {
				console.log('Connection succesfuly')
			}
		})
	} catch (err) {
		console.log("Server does not connect", err);
	}
}