/**
 * Configuration for the API required by the application.
 *
 * @file appConfig.ts
 * @author Carla da Silva Alves
 */

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const HOST_URL = `http://${HOST}:${PORT}`;

/**
 * Application configuration includes default values for the
 * port and host, but they can be overridden by environment
 * variables stored in a .env file to ensure security.
 */
export const appConfig = {
	server: {
		port: PORT,
		host: HOST,
		host_url: HOST_URL
	}
};
