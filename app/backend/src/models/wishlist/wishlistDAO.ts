/**
 * Handles database interactions to perform CRUD operations for the Wishlist entity.
 *
 * @file WishlistDAO.ts
 * @description Data Access Object (DAO) for wishlists.
 * @author Carla da Silva Alves
 */
import { getConnectionPool } from '../../config/dbConnection';
import { Pool } from 'mysql2/promise';
import { Wishlist } from './Wishlist';

export class WishlistDAO {
	private static pool: Pool;
	static async init() {
		WishlistDAO.pool = await getConnectionPool();
	}

	/**
	 * Reads all wishlists from the database.
	 *
	 * @returns {Promise<Wishlist[]>} - An array of all wishlists in the database.
	 */
	async selectWishlists(): Promise<Wishlist[]> {
		try {
			const query = 'SELECT * FROM wishlist JOIN product p ON wishlist.product_id = p.product_id';

			const [results]: any = await WishlistDAO.pool.query(query);

			return results.map((row: any) => ({
				wishlistId: row.wishlist_id,
				userId: row.user_id,
				productId: row.product_id,
				createdAt: row.created_at,
				product: {
					name: row.name,
					description: row.description,
					brand: row.brand,
					price: row.price,
					imageUrl: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching wishlists with product details:', err);
			throw { statusCode: 500, message: 'Failed to fetch wishlists.' };
		}
	}

	/**
	 * Reads a single wishlist by its ID.
	 *
	 * @param {number} id - The ID of the wishlist.
	 * @returns {Promise<Wishlist | null>} - The wishlist with the specified ID or null if not found.
	 */
	async selectWishlistById(id: number): Promise<Wishlist | null> {
		try {
			const query = 'SELECT * FROM wishlist JOIN product p ON wishlist.product_id = p.product_id WHERE wishlist_id = ?';

			const [results]: any = await WishlistDAO.pool.query(query, [id]);
			if (results.length === 0) {
				return null;
			}
			return results.map((row: any) => ({
				wishlistId: row.wishlist_id,
				userId: row.user_id,
				productId: row.product_id,
				createdAt: row.created_at,
				product: {
					name: row.name,
					description: row.description,
					brand: row.brand,
					price: row.price,
					imageUrl: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching wishlist:', err);
			throw { statusCode: 500, message: 'Failed to fetch wishlist.' };
		}
	}

	/**
	 * Reads all wishlists associated with a given user.
	 *
	 * @param {number} userId - The ID of the user.
	 * @returns {Promise<Wishlist[]>} - An array of all wishlists associated with the user.
	 */
	async selectWishlistsByUserId(userId: number): Promise<Wishlist[]> {
		try {
			const query =
				'SELECT * FROM `wishlist` JOIN `product` p ON wishlist.product_id = p.product_id WHERE `user_id` = ?';
			const [results]: any = await WishlistDAO.pool.query(query, [userId]);
			return results.map((row: any) => ({
				wishlistId: row.wishlist_id,
				userId: row.user_id,
				productId: row.product_id,
				createdAt: row.created_at,
				product: {
					name: row.name,
					description: row.description,
					brand: row.brand,
					price: row.price,
					imageUrl: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching wishlists:', err);
			throw { statusCode: 500, message: 'Failed to fetch wishlists.' };
		}
	}

	/**
	 * Creates a new wishlist item in the database.
	 * @param {Wishlist} wishlist - The wishlist to create.
	 * @returns {Promise<Wishlist>} - The created wishlist.
	 *
	 */
	async createWishlist(wishlist: Wishlist): Promise<Wishlist> {
		try {
			const query = 'INSERT INTO `wishlist` (`user_id`) VALUES (?)';
			const [result]: any = await WishlistDAO.pool.query(query, [wishlist.userId]);

			return { ...wishlist, wishlistId: result.insertId };
		} catch (err) {
			console.error('Error creating wishlist:', err);
			throw { statusCode: 500, message: 'Failed to create wishlist.' };
		}
	}

	/**
	 * Inserts a new wishlist in the database.
	 *
	 * @param {Wishlist} wishlist - The wishlist to create.
	 * @returns {Promise<Wishlist>} - The created wishlist.
	 */
	async insertWishlistItem(wishlist: Omit<Wishlist, 'wishlistId'>): Promise<Wishlist> {
		try {
			const query = 'INSERT INTO `wishlist` (`user_id`, `product_id`, `created_at`) VALUES (?, ?, ?)';

			const [result]: any = await WishlistDAO.pool.query(query, [
				wishlist.userId,
				wishlist.productId,
				wishlist.createdAt
			]);

			return result.insertId;
		} catch (err) {
			console.error('Error creating wishlist:', err);
			throw { statusCode: 500, message: 'Failed to create wishlist.' };
		}
	}

	/**
	 * Updates an existing wishlist in the database.
	 *
	 * @param {Wishlist} wishlist - The updated wishlist.
	 * @returns {Promise<Wishlist>} - The updated wishlist.
	 */
	async updateWishlist(wishlist: Wishlist): Promise<Wishlist> {
		try {
			const query = 'UPDATE `wishlist` SET `user_id` = ? WHERE `wishlist_id` = ?';
			await WishlistDAO.pool.query(query, [wishlist.userId, wishlist.wishlistId]);

			return wishlist;
		} catch (err) {
			console.error('Error updating wishlist:', err);
			throw { statusCode: 500, message: 'Failed to update wishlist.' };
		}
	}

	/**
	 * Deletes a wishlist from the database.
	 *
	 * @param {number} id - The ID of the wishlist to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 * @returns {Promise<void>}
	 */
	async deleteWishlistById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM `wishlist` WHERE `wishlist_id` = ?';
			const [results]: any = await WishlistDAO.pool.query(query, [id]);
			if (results.affectedRows > 0) {
				return { success: true, message: 'Wishlist deleted successfully' };
			}
			return { success: false, message: 'Wishlist not found.' };
		} catch (err) {
			console.error('Error deleting wishlist:', err);
			throw { statusCode: 500, message: 'Failed to delete wishlist.' };
		}
	}

	/**
	 * Deletes all wishlists associated with a given user from the database.
	 *
	 * @param {number} userId - The ID of the user.
	 * @param {string} message - The message to return.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 * @throws {Error} - If an error occurs while deleting the wishlists.
	 */
	async deleteWishlistsByUserId(userId: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM `wishlist` WHERE `user_id` = ?';
			const [results]: any = await WishlistDAO.pool.query(query, [userId]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'Wishlists deleted successfully' };
			}
			return { success: false, message: 'No wishlists found for user.' };
		} catch (err) {
			console.error('Error deleting wishlists:', err);
			throw { statusCode: 500, message: 'Failed to delete wishlists.' };
		}
	}

	/**
	 * Deletes all wishlists from the database.
	 * @returns {Promise<void>}
	 * @throws {Error} - If an error occurs while deleting the wishlists.
	 */
	async deleteAllWishlists(): Promise<void> {
		try {
			const query = 'DELETE FROM `wishlist`';
			await WishlistDAO.pool.query(query);
		} catch (err) {
			console.error('Error deleting wishlists:', err);
			throw { statusCode: 500, message: 'Failed to delete wishlists.' };
		}
	}
}
