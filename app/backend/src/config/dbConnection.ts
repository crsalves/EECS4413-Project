/**
 * Connection and configuration of MySQL database using a
 * connection pool. A connection pool is the standard way
 * to manage database connections in web applications. It
 * allows multiple connections to be created and reused
 * efficiently, supporting concurrent requests.
 *
 * @file dbConnection.ts
 * @author Carla da Silva Alves
 */

import mysql, { Pool } from 'mysql2/promise';
import { dbConfig } from './dbConfig';
import { AppError } from '../utils/ErrorHandler';

// Connection pool for MySQL database
let pool: mysql.Pool | null = null;

/**
 * Creates a connection pool for the MySQL database.
 * @returns {mysql.Pool} - The connection pool for the MySQL database
 * @throws {AppError} - Failed to create connection pool
 */
export async function createPoolConnectionDB(): Promise<Pool> {
	try {
		if (!pool) {
			console.log('Initializing database connection pool...');
			pool = mysql.createPool(dbConfig.connection);
			console.log('Database connection pool initialized.');
		}

		return pool;
	} catch (err: any) {
		console.error('Error creating connection pool:', err.message);
		throw new AppError(500, 'Failed to create connection pool');
	}
}

/**
 * Retrieves the existing connection pool instance.
 * Throws an error if the pool has not been initialized.
 * This method refers to the Singleton design pattern.
 */
export function getConnectionPool(): Pool {
	if (!pool) {
		throw new Error('Database connection pool has not been initialized.');
	}
	return pool;
}
