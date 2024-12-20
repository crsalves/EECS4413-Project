/**
 * Handles GET, POST, PUT, DELETE requests for wishlist.
 *
 * @file wishlistRoute.ts
 * @author Carla da Silva Alves
 */

import { Router, Request, Response } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const wishlistRouter = Router();
const wishlistController = new WishlistController(); // Initialize the WishlistController instance to handle wishlist operations

/**
 * Retrieves complete information of all wishlists.
 *
 * @returns {Array} List of wishlists.
 *
 * @throws {404} If no wishlists are found in the database.
 * @throws {500} If there is an error fetching wishlists.
    */
wishlistRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const wishlists = await wishlistController.getWishlists();
    if (wishlists.length === 0) {
        return res.status(404).json({ message: 'No wishlists found in the database.' });
    }
    return res.status(200).json({ message: 'Wishlists retrieved successfully.', data: wishlists });
})
);

/**
 * Retrieves complete information of a specific wishlist.
 *
 * @param {number} id - The ID of the wishlist to retrieve.
 * @returns {Wishlist} The wishlist with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the wishlist is not found.
 * @throws {500} If there is an error fetching the wishlist.
 * @throws {403} If the user is not authorized to view the wishlist.
    */
wishlistRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid wishlist ID. ID must be a positive number.' });
    }

    const wishlist = await wishlistController.getWishlistById(id);
    if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found.' });
    }

    return res.status(200).json({ message: 'Wishlist retrieved successfully.', data: wishlist });
})
);

/**
 * Retrieves wishlists by a specific user.
 *
 * @param {number} userId - The ID of the user whose wishlists to retrieve.
 * @returns {Array} List of wishlists associated with the specified user.
 * @throws {400} If the user ID is invalid.
 */
wishlistRouter.get('/user/:userId', asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'Invalid user ID. ID must be a positive number.' });
    }

    const wishlists = await wishlistController.getWishlistsByUserId(userId);
    if (wishlists.length === 0) {
        return res.status(404).json({ message: 'No wishlists found for the specified user.' });
    }

    return res.status(200).json({ message: 'Wishlists retrieved successfully.', data: wishlists });
})
);

/**
 * Adds a new wishlist to the database.
 *
 * @param {Omit<Wishlist, 'wishlistId' | 'createdAt' | 'updatedAt'>} wishlist - Wishlist data to insert.
 * @returns {Object} Success message or error message.
 * @throws {400} If required fields are missing or invalid.
 */
wishlistRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
    const wishlistData = req.body;

    // Validate required fields
    if (!wishlistData.userId || !wishlistData.products) {
        return res.status(400).json({ message: 'Missing required fields: userId and products.' });
    }

    const result = await wishlistController.createWishlist(wishlistData);
    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(201).json({ message: 'Wishlist created successfully.', data: result.message });
})
);

/**
 * Updates a wishlist by its ID in the database.
 *
 * @param {number} id - The ID of the wishlist to update.
 * @param {Partial<Wishlist>} updates - Contains fields to update in the wishlist.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID or update fields are invalid.
 * @throws {404} If the wishlist is not found.
 */
wishlistRouter.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid wishlist ID. ID must be a positive number.' });
    }

    const updates = req.body;

    const result = await wishlistController.editWishlistById(id, updates);
    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: 'Wishlist updated successfully.', data: result.message });
})
);

/**
 * Deletes a wishlist by its ID from the database.
 *
 * @param {number} id - The ID of the wishlist to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 */
wishlistRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid wishlist ID. ID must be a positive number.' });
    }

    const result = await wishlistController.removeWishlistItemById(id);
    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: 'Wishlist deleted successfully.' });
})
);
