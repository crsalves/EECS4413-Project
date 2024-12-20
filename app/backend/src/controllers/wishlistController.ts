/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file wishlistController.ts
 * @author Carla da Silva Alves
 */

import { Wishlist } from '../models/wishlist/Wishlist';
import { WishlistDAO } from '../models/wishlist/wishlistDAO';

export class WishlistController {
	private wishlistDAO: WishlistDAO;

	constructor() {
		this.wishlistDAO = new WishlistDAO();
	}

	/**
	 * @returns {Promise<Wishlist[]>} - An array of all wishlists in the database.
	 */
	async getWishlists(): Promise<Wishlist[]> {
		try {
			const wishlists = await this.wishlistDAO.selectWishlists();
			return wishlists || [];
		} catch (err) {
			console.error('Error fetching wishlists:', err);
			throw { statusCode: 500, message: 'Failed to fetch wishlists' };
		}
	}

	/**
	 * @param {number} userId - The ID of the user.
	 * @returns {Promise<Wishlist[]>} - An array of wishlists associated with the specified user.
	 */
	async getWishlistsByUserId(userId: number): Promise<Wishlist[]> {
		try {
			const wishlists = await this.wishlistDAO.selectWishlistsByUserId(userId);
			return wishlists || [];
		} catch (err) {
			console.error(`Error fetching wishlists for user with ID ${userId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch wishlists' };
		}
	}

	/**
	 * @param {number} id - The ID of the wishlist.
	 * @returns {Promise<Wishlist | null>} - The wishlist with the specified ID or null if not found.
	 */
	async getWishlistById(id: number): Promise<Wishlist | null> {
		try {
			const wishlist = await this.wishlistDAO.selectWishlistById(id);
			return wishlist || null;
		} catch (err) {
			console.error(`Error fetching wishlist with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch wishlist' };
		}
	}

	/**
	 * @param {Omit<Wishlist, 'wishlistId'>} wishlist - The wishlist data to insert.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async createWishlist(wishlist: Omit<Wishlist, 'wishlistId'>): Promise<{ success: boolean; message: string }> {
		try {
			const newWishlist = await this.wishlistDAO.insertWishlistItem(wishlist);

			if (newWishlist) {
				return { success: true, message: 'Wishlist created successfully' };
			}
			return { success: false, message: 'Failed to create wishlist' };
		} catch (err) {
			console.error('Error creating new wishlist:', err);
			throw { statusCode: 500, message: 'Failed to create new wishlist' };
		}
	}

	/**
	 * add item to wishlist
	 * @param wishlistId - wishlist id
	 * @return {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 * @throws {500} If there is an error adding item to wishlist.
	 * @throws {404} If the wishlist is not found.
	 */
	async addItemToWishlist(wishlistId: number): Promise<{ success: boolean; message: string }> {
		try {
			const existingWishlist = await this.getWishlistById(wishlistId);

			if (!existingWishlist) {
				throw { statusCode: 404, message: 'Wishlist not found' };
			}

			const updatedWishlist = await this.wishlistDAO.updateWishlist({ ...existingWishlist, wishlistId });

			if (!updatedWishlist) {
				throw { statusCode: 500, message: 'Failed to add item to wishlist' };
			}
			return { success: true, message: 'Item added to wishlist successfully' };
		} catch (err) {
			console.error(`Error adding item to wishlist with ID ${wishlistId}:`, err);
			throw { statusCode: 500, message: 'Failed to add item to wishlist' };
		}
	}

	/**
	 * @param {number} id - The ID of the wishlist to update.
	 * @param {Partial<Wishlist>} updates - Contains fields to update in the wishlist.
	 *
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 * @throws {500} If there is an error updating the wishlist.
	 * @throws {404} If the wishlist is not found.
	 */
	async editWishlistById(id: number, updates: Partial<Wishlist>): Promise<{ success: boolean; message: string }> {
		try {
			const existingWishlist = await this.getWishlistById(id);

			if (!existingWishlist) {
				throw { statusCode: 404, message: 'Wishlist not found' };
			}
			const updatedWishlist = await this.wishlistDAO.updateWishlist({
				...existingWishlist,
				...updates,
				wishlistId: id
			});
			return { success: true, message: 'Wishlist updated successfully' };
		} catch (err) {
			console.error(`Error updating wishlist with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update wishlist' };
		}
	}

	/**
	 * @param {number} id - The ID of the wishlist to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 * @throws {500} If there is an error deleting the wishlist.
	 * @throws {404} If the wishlist is not found.
	 */
	async removeWishlistItemById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const existingWishlist = await this.getWishlistById(id);

			if (!existingWishlist) {
				throw { statusCode: 404, message: 'Wishlist not found' };
			}
			await this.wishlistDAO.deleteWishlistById(id);
			return { success: true, message: 'Wishlist deleted successfully' };
		} catch (err) {
			console.error(`Error deleting wishlist with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete wishlist' };
		}
	}

	/**
	 * Deletes all wishlists from the database.
	 * @returns {Promise<void>}
	 * @throws {500} If there is an error deleting all wishlists.
	 * @throws {404} If there are no wishlists to delete.
	 */
	async deleteAllWishlists(): Promise<void> {
		try {
			await this.wishlistDAO.deleteAllWishlists();
		} catch (err) {
			console.error('Error deleting all wishlists:', err);
			throw { statusCode: 500, message: 'Failed to delete all wishlists' };
		}
	}

	/**
	 * Deletes all wishlists associated with a given user from the database.
	 * @param {number} userId - The ID of the user.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 * @throws {500} If there is an error deleting the wishlists.
	 * @throws {404} If there are no wishlists to delete.
	 */
	async deleteWishlistsByUserId(userId: number): Promise<{ success: boolean; message: string }> {
		try {
			const existingWishlists = await this.getWishlistsByUserId(userId);

			if (!existingWishlists.length) {
				throw { statusCode: 404, message: 'No wishlists found for this user' };
			}

			await this.wishlistDAO.deleteWishlistsByUserId(userId);
			return { success: true, message: 'Wishlists deleted successfully' };
		} catch (err) {
			console.error(`Error deleting wishlists for user with ID ${userId}:`, err);
			throw { statusCode: 500, message: 'Failed to delete wishlists' };
		}
	}
}
