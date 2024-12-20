import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
	connection: {
		host: process.env.DB_HOST_ALIAS || '127.0.0.1',
		port: parseInt(process.env.DB_PORT || '3306', 10),
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'password',
		database: process.env.DB_NAME || 'pet_store',
		connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '150', 10),
		waitForConnections: process.env.DB_WAIT_FOR_CONNECTION === 'true',
		queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0', 10)
	}
};
