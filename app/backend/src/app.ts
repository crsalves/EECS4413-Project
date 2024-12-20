/**
 * Entry point that runs first when the backend (API) application starts.
 *
 * @file app.ts
 * @author Carla da Silva Alves
 */

import express from 'express';
import bodyParser from 'body-parser';
import { router } from './routes'; // Main route file, imports other routes
import { ErrorHandler } from './utils/ErrorHandler'; // Handles process-level errors
import { errorMiddleware } from './middlewares/errorMiddleware'; // Middleware for handling route-level errors
import { appConfig } from './config/appConfig'; // Application configuration
import { createPoolConnectionDB } from './config/dbConnection'; // Database connection pool
import { CategoryDAO } from './models/category/categoryDAO';
import { ProductDAO } from './models/product/productDAO';
import { UserDAO } from './models/user/UserDAO';
import { OrderDAO } from './models/order/orderDAO';
import { WishlistDAO } from './models/wishlist/wishlistDAO';
import { ReviewDAO } from './models/review/reviewDAO';
import { PaymentDAO } from './models/payment/paymentDAO';

const app = express();

// Initialize the error handler globally for process-level errors
new ErrorHandler();

/**
 * Initialize the database connection pool before starting the server.
 * Exits the application if the pool initialization fails.
 */
async function initializeDatabase() {
	try {
		await createPoolConnectionDB();
		console.log('Database connection pool initialized successfully.');
	} catch (err) {
		console.error('Error initializing database connection pool:', err);
		process.exit(1); // Exit the process if the database pool fails to initialize
	}
}

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// Set CORS headers and handle preflight requests
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// Handle preflight OPTIONS request
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}

	next();
});

// Main route
app.use(router);

// Global error middleware to handle errors from routes/controllers/models
app.use(errorMiddleware);

// Variables Section
const PORT = Number(appConfig.server.port);
const HOST = appConfig.server.host;
const HOST_URL = appConfig.server.host_url;

/**
 * Start the server after initializing required components.
 */
async function startServer() {
	await initializeDatabase(); // Ensure database connection pool is initialized

	// Initialize all DAOs
	await CategoryDAO.init();
	await OrderDAO.init();
	await ProductDAO.init();
	await UserDAO.init();
	await WishlistDAO.init();
	await ReviewDAO.init();
	await PaymentDAO.init();

	console.log('All DAOs initialized successfully.');

	app.listen(PORT, HOST, () => {
		console.log(`Server running at ${HOST_URL}`);
		console.log(`Press Ctrl+C to quit.`);
	});
}

startServer();
