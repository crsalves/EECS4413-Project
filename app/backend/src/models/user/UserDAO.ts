/**
 * Handles database interactions to perform CRUD operations.
 *
 * @file UserDAO.ts
 * @description Data Access Object (DAO).
 * @author Carla da Silva Alves
 */
import { getConnectionPool } from '../../config/dbConnection';
import { User } from './User';
import { Pool } from 'mysql2/promise';

export class UserDAO {
	private static pool: Pool;
	static async init() {
        UserDAO.pool = await getConnectionPool();
    }

	/**
	 * @returns {Promise<User[]>} - selects all users from the database.
	 */
	async selectUsers(): Promise<User[]> {
		try {
			const query = 'SELECT * FROM `user`';
			const [results]: any = await UserDAO.pool.query(query);

			return results.map((row: any) => ({
				userId: row.user_id,
				name: row.name,
				email: row.email,
				passwordHash: row.password_hash,
				phone: row.phone,
				addressStreet: row.address_street,
				addressComplement: row.address_complement,
				addressProvince: row.address_province,
				addressCountry: row.address_country,
				addressPostalCode: row.address_postal_code,
				role: row.role,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error('Error fetching users:', err);
			throw { statusCode: 500, message: 'Failed to fetch user data.' };
		}
	}

	/**
	 * Selects a single user by their ID.
	 *
	 * @param {number} id - The ID of the user to fetch.
	 * @returns {Promise<User | null>} - The user with the specified ID or null if not found.
	 */
	async selectUserById(id: number): Promise<User | null> {
		try {
			const query = 'SELECT * FROM `user` WHERE user_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				userId: row.user_id,
				name: row.name,
				email: row.email,
				passwordHash: row.password_hash,
				phone: row.phone,
				addressStreet: row.address_street,
				addressComplement: row.address_complement,
				addressProvince: row.address_province,
				addressCountry: row.address_country,
				addressPostalCode: row.address_postal_code,
				role: row.role,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			};
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user by ID.' };
		}
	}

	/**
	 * Selects a user by their email address.
	 *
	 * @param {string} email - The email address of the user to fetch.
	 * @returns {Promise<User | null>} - The user with the specified email, or null if not found.
	 * @throws {Error} - Throws an error if the query fails or encounters unexpected issues.
	 */
	async selectUserByEmail(email: string): Promise<any> {
		try {
			const query = 'SELECT * FROM `user` WHERE email = ?';
			const [results]: any = await UserDAO.pool.query(query, [email]);

			// If no user is found, return null
			if (results.length === 0) {
				return null;
			}

			const row = results[0];
			return {
				userId: row.user_id,
				name: row.name,
				email: row.email,
				passwordHash: row.password_hash,
				phone: row.phone,
				role: row.role
			};
		} catch (err) {
			console.error(`Error fetching user by email (${email}):`, err);

			// Throw a structured error for consistent error handling
			throw { statusCode: 500, message: 'Failed to fetch user by email.' };
		}
	}

	/**
	 * Inserts a new user into the database.
	 *
	 * @param {Omit<User, 'userId' | 'createdAt' | 'updatedAt'>} user - The user data to insert.
	 * @returns {Promise<number>} - The ID of the newly inserted user.
	 */
	async insertUser(user: any): Promise<number | null> {
		try {
			const [result] = await UserDAO.pool.query(
				`
                INSERT INTO user
                (name, email, password_hash, phone, address_street, address_complement, address_province, address_country, address_postal_code, role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					user.name,
					user.email,
					user.passwordHash,
					user.phone,
					user.address_street,
					user.address_complement,
					user.address_province,
					user.address_country,
					user.address_postal_code,
					user.role
				]
			);
			return (result as any).insertId;
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') {
				// Handle duplicate key error
				throw { statusCode: 409, message: `A user with the email '${user.email}' already exists.` };
			}
			// Log and rethrow any other errors
			console.error('Error inserting new user:', err);
			throw { statusCode: 500, message: 'Failed to insert user data.' };
		}
	}

	/**
	 * Updates an existing user in the database.
	 *
	 * @param {number} id - The ID of the user to update.
	 * @param {Partial<User>} user - The fields to update.
	 * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
	 */
	async updateUserById(id: number, user: Partial<User>): Promise<boolean> {
		try {
			const query = `
            UPDATE user
            SET name = COALESCE(?, name),
                email = COALESCE(?, email),
                password_hash = COALESCE(?, password_hash),
                phone = COALESCE(?, phone),
                address_street = COALESCE(?, address_street),
                address_complement = COALESCE(?, address_complement),
                address_province = COALESCE(?, address_province),
                address_country = COALESCE(?, address_country),
                address_postal_code = COALESCE(?, address_postal_code),
                role = COALESCE(?, role)
            WHERE user_id = ?
        `;
			const [results]: any = await UserDAO.pool.query(query, [
				user.name,
				user.email,
				user.passwordHash,
				user.phone,
				user.addressStreet,
				user.addressComplement,
				user.addressProvince,
				user.addressCountry,
				user.addressPostalCode,
				user.role,
				id
			]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update user data.' };
		}
	}

	/**
	 * Deletes a user from the database by their ID.
	 *
	 * @param {number} id - The ID of the user to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - The result of the deletion.
	 */
	async deleteUserById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM user WHERE user_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'User deleted successfully.' };
			}

			return { success: false, message: 'User not found.' };
		} catch (err: any) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				return {
					success: false,
					message: 'Failed to delete user due to dependencies.'
				};
			}

			console.error(`Unexpected error during deletion of user with ID ${id}:`, err);
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the user.'
			};
		}
	}

	async selectUserAddress(id: number): Promise<any[] | null> {
		try {
			const query = 'SELECT * FROM `user_address` WHERE user_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.length === 0) return [];

			return results.map((row: any) => ({
				userAddressId: row.user_address_id,
				userId: row.user_id,
				street: row.street,
				complement: row.complement,
				city: row.city,
				province: row.province,
				country: row.country,
				postalCode: row.postal_code,
				isDefault: row.is_default
			}));
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user by ID.' };
		}
	}

	async selectUserAddressById(id: number): Promise<any | null> {
		try {
			const query = 'SELECT * FROM `user_address` WHERE user_address_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				userId: row.user_id,
				street: row.street,
				complement: row.complement,
				city: row.city,
				province: row.province,
				country: row.country,
				postalCode: row.postal_code,
				isDefault: row.is_default
			};
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user by ID.' };
		}
	}

	async insertUserAddress(user: any): Promise<any | null> {
		try {
			const [result] = await UserDAO.pool.query(
				`
                INSERT INTO user_address
                (user_id, street, complement, city,  province, country, postal_code, is_default) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					user.userId,
					user.street,
					user.complement,
					user.ciy,
					user.province,
					user.country,
					user.postaCode,
					user.isDefault
				]
			);
			return { userAddressId: (result as any).insertId };
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') {
				// Handle duplicate key error
				throw { statusCode: 409, message: `An error occurred` };
			}
			// Log and rethrow any other errors
			console.error('Error inserting new user:', err);
			throw { statusCode: 500, message: 'Failed to insert user address data.' };
		}
	}

	async deleteUserAddressById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM user_address WHERE user_address_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'User deleted successfully.' };
			}

			return { success: false, message: 'User not found.' };
		} catch (err: any) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				return {
					success: false,
					message: 'Failed to delete user due to dependencies.'
				};
			}

			console.error(`Unexpected error during deletion of user with ID ${id}:`, err);
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the user.'
			};
		}
	}

	async updateUserAddressById(id: number, user: Partial<any>): Promise<boolean> {
		try {
			const query = `
            UPDATE user_address
            SET street = COALESCE(?, street),
				complement = COALESCE(?, complement),
				province = COALESCE(?, province),
				country = COALESCE(?, country),
				postal_code = COALESCE(?, postal_code),
				is_default = COALESCE(?, is_default)
            WHERE user_address_id = ?
        `;
			const [results]: any = await UserDAO.pool.query(query, [
				user.street,
				user.complement,
				user.province,
				user.country,
				user.postal_code,
				user.is_default,
				id
			]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update user data.' };
		}
	}

	async selectUserPayment(id: number): Promise<any[] | null> {
		try {
			const query = `SELECT user_payment_info.user_payment_id AS user_payment_id,
					user_payment_info.user_id AS user_id,
					user_payment_info.card_number AS card_number,
					user_payment_info.expiry_date AS expire_date,
					user_payment_info.is_default as is_default,
					user_payment_info.cvv as cvv,
					payment_type.\`type\` AS card_type,
					card_issuer.name as card_issuer_name
					FROM \`user_payment_info\`
					JOIN \`payment_type\` ON user_payment_info.payment_type_id = payment_type.payment_type_id
					JOIN card_issuer ON card_issuer.card_issuer_id = payment_type.card_issuer_id
					WHERE  user_id = ?	`;
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.length === 0) return [];

			return results.map((row: any) => ({
				userPaymentId: row.user_payment_id,
				userId: row.user_id,
				cardNumber: row.card_number,
				expiryDate: row.expire_date,
				cvv: row.cvv,
				cardType: row.card_type,
				cardIssuerName: row.card_issuer_name,
				isDefault: row.is_default
			}));
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user by ID.' };
		}
	}

	async selectUserPaymentById(id: number): Promise<any | null> {
		try {
			const query = 'SELECT * FROM `user_payment_info` WHERE user_payment_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				userPaymentId: row.user_payment_id,
				userId: row.user_id,
				cardNumber: row.card_number,
				expiryDate: row.expiry_date,
				cvv: row.cvv,
				paymentTypeId: row.payment_type_id,
				isDefault: row.is_default
			};
		} catch (err) {
			console.error(`Error fetching user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch user by ID.' };
		}
	}

	async insertUserPayment(user: any): Promise<any | null> {
		try {
			const [result] = await UserDAO.pool.query(
				`
                INSERT INTO user_payment_info
                (user_id, card_number, expiry_date, cvv, payment_type_id, is_default)
                VALUES (?, ?, ?, ?, ?, ?)`,
				[user.userId, user.cardNumber, user.expiryDate, user.cvv, user.paymentTypeId, user.isDefault]
			);
			return { userPaymentId: (result as any).insertId };
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') {
				// Handle duplicate key error
				throw { statusCode: 409, message: `An error occurred` };
			}
			// Log and rethrow any other errors
			console.error('Error inserting new user:', err);
			throw { statusCode: 500, message: 'Failed to insert user address data.' };
		}
	}

	async updateUserPaymentById(id: number, user: Partial<any>): Promise<boolean> {
		try {
			const query = `
            UPDATE user_payment_info
            SET user_id = COALESCE(?, user_id),
				card_number = COALESCE(?, card_number),
				expiry_date = COALESCE(?, expiry_date),
				cvv = COALESCE(?, cvv),
				payment_type_id = COALESCE(?, payment_type_id),
				is_default = COALESCE(?, is_default)
            WHERE user_payment_id = ?
        `;
			const [results]: any = await UserDAO.pool.query(query, [
				user.userId,
				user.cardNumber,
				user.expiryDate,
				user.cvv,
				user.paymentTypeId,
				user.isDefault,
				id
			]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating user with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update user data.' };
		}
	}

	async deleteUserPaymentById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM user_payment_info WHERE user_payment_id = ?';
			const [results]: any = await UserDAO.pool.query(query, [id]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'User deleted successfully.' };
			}

			return { success: false, message: 'User not found.' };
		} catch (err: any) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				return {
					success: false,
					message: 'Failed to delete user due to dependencies.'
				};
			}

			console.error(`Unexpected error during deletion of user with ID ${id}:`, err);
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the user.'
			};
		}
	}
}
