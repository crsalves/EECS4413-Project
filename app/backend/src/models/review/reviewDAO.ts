/**
 * Handles database interactions to perform CRUD operations for the Review entity.
 *
 * @file ReviewDAO.ts
 * @description Data Access Object (DAO) for reviews.
 * @author Carla da Silva Alves
 */
import { getConnectionPool } from '../../config/dbConnection';
import { Pool } from 'mysql2/promise';
import { Review } from './Review';

export class ReviewDAO {
	private static pool: Pool;
	static async init() {
        ReviewDAO.pool = await getConnectionPool();
    }

	/**
	 * Creates a new review by a user ID and product ID.
	 */
	async insertReviewByUserIdAndProductId(review: Review): Promise<Review> {
		try {
			const query = 'INSERT INTO `review` (user_id, product_id, rating, comment, date) VALUES (?, ?, ?, ?, ?)';

			const [result]: any = await ReviewDAO.pool.query(query, [
				review.userId,
				review.productId,
				review.rating,
				review.comment,
				review.date
			]);
			return result.insertId;
		} catch (err) {
			console.error('Error creating review:', err);
			throw { statusCode: 500, message: 'Failed to create review.' };
		}
	}

	/**
	 * Retrieves all reviews.
	 * @returns {Promise<Review[]>} - An array of all reviews.
	 */
	async selectReviews(): Promise<Review[]> {
		try {
			const query = 'SELECT * FROM `review` JOIN `product` p ON reviews.product_id = p.product_id';
			const [results]: any = await ReviewDAO.pool.query(query);
			return results.map((row: any) => ({
				reviewId: row.review_id,
				userId: row.user_id,
				productId: row.product_id,
				rating: row.rating,
				comment: row.comment,
				date: row.date,
				product: {
					name: row.name,
					imageURL: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching reviews:', err);
			throw { statusCode: 500, message: 'Failed to fetch reviews.' };
		}
	}

	/**
	 * Retrieves reviews by a user ID.
	 * @param {number} userId - The ID of the user whose reviews to fetch.
	 * @returns {Promise<Review[]>} - An array of reviews for the specified user.
	 */
	async selectReviewsByUserId(userId: number): Promise<Review[]> {
		try {
			const query = 'SELECT * FROM `review` JOIN `product` p ON reviews.product_id = p.product_id WHERE user_id = ?';
			const [results]: any = await ReviewDAO.pool.query(query, [userId]);
			return results.map((row: any) => ({
				reviewId: row.review_id,
				userId: row.user_id,
				productId: row.product_id,
				rating: row.rating,
				comment: row.comment,
				date: row.date,
				product: {
					name: row.name,
					imageURL: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching reviews for user with ID:', userId, err);
			throw { statusCode: 500, message: 'Failed to fetch reviews.' };
		}
	}

	/**
	 * Retrieves all reviews with product details.
	 * @returns {Promise<any[]>} - An array of reviews joined with product and user information.
	 */
	async selectAllReviews(): Promise<any[]> {
		try {
			const query = 'SELECT * FROM `review` JOIN `product` p ON review.product_id = p.product_id';

			const [results]: any = await ReviewDAO.pool.query(query);

			return results.map((row: any) => ({
				reviewId: row.review_id,
				userId: row.user_id,
				productId: row.product_id,
				rating: row.rating,
				comment: row.comment,
				date: row.date,
				product: {
					name: row.name,
					imageURL: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching reviews:', err);
			throw { statusCode: 500, message: 'Failed to fetch reviews.' };
		}
	}

	/**
	 * Retrieves a review by its ID.
	 * @param {number} reviewId - The ID of the review to fetch.
	 * @returns {Promise<Review | null>} - A single review object or null.
	 */
	async selectReviewById(reviewId: number): Promise<Review | null> {
		try {
			const query = 'SELECT * FROM `review` WHERE review_id = ?';
			const [results]: any = await ReviewDAO.pool.query(query, [reviewId]);
			if (results.length === 0) return null;
			return results.map((row: any) => ({
				reviewId: row.review_id,
				userId: row.user_id,
				productId: row.product_id,
				rating: row.rating,
				comment: row.comment,
				date: row.date,
				product: {
					name: row.name,
					imageURL: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching review by ID:', err);
			throw { statusCode: 500, message: 'Failed to fetch review.' };
		}
	}

	/**
	 * Retrieves all reviews for a specific product.
	 * @param {number} productId - The ID of the product for which to fetch reviews.
	 * @returns {Promise<Review[]>} - An array of reviews for the specified product.
	 *
	 */
	async selectReviewsByProductId(productId: number): Promise<Review[]> {
		try {
			const query = 'SELECT * FROM reviews WHERE product_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [productId]);
			return results.map((row: any) => ({
				reviewId: row.review_id,
				userId: row.user_id,
				productId: row.product_id,
				rating: row.rating,
				comment: row.comment,
				date: row.date,
				product: {
					name: row.name,
					imageURL: row.image_url
				}
			}));
		} catch (err) {
			console.error('Error fetching reviews by product ID:', err);
			throw { statusCode: 500, message: 'Failed to fetch reviews.' };
		}
	}

	/**
	 * Updates a review by its ID.
	 * @param {number} reviewId - The ID of the review to update.
	 * @param {Partial<Review>} updatedReview - The fields to update.
	 */
	async updateReview(reviewId: number, updatedReview: Partial<Review>): Promise<boolean> {
		try {
			const query = 'UPDATE `review` SET? WHERE review_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [updatedReview, reviewId]);
			return results.affectedRows > 0;
		} catch (err) {
			console.error('Error updating review:', err);
			throw { statusCode: 500, message: 'Failed to update review.' };
		}
	}

	/**
	 * Updates a review by product ID.
	 * @param {number} productId - The ID of the product for which to update reviews.
	 * @param {Partial<Review>} updatedReview - The fields to update.
	 * @returns {Promise<void>}
	 */
	async updateReviewsByProductId(productId: number, updatedReview: Partial<Review>): Promise<boolean> {
		try {
			const query = 'UPDATE `review` SET? WHERE product_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [updatedReview, productId]);
			return results.affectedRows > 0;
		} catch (err) {
			console.error('Error updating reviews by product ID:', err);
			throw { statusCode: 500, message: 'Failed to update reviews.' };
		}
	}

	/**
	 * Updates a review by user ID.
	 * @param {number} userId - The ID of the user for which to update reviews.
	 * @param {Partial<Review>} updatedReview - The fields to update.
	 * @returns {Promise<void>}
	 * */
	async updateReviewsByUserId(userId: number, updatedReview: Partial<Review>): Promise<boolean> {
		try {
			const query = 'UPDATE `review` SET? WHERE user_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [updatedReview, userId]);
			return results.affectedRows > 0;
		} catch (err) {
			console.error('Error updating reviews by user ID:', err);
			throw { statusCode: 500, message: 'Failed to update reviews.' };
		}
	}

	/**
	 * Deletes a review by its ID.
	 * @param {number} reviewId - The ID of the review to delete.
	 */
	async deleteReview(reviewId: number): Promise<boolean> {
		try {
			const query = 'DELETE FROM `review` WHERE review_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [reviewId]);
			return results.affectedRows > 0;
		} catch (err) {
			console.error('Error deleting review:', err);
			throw { statusCode: 500, message: 'Failed to delete review.' };
		}
	}

	/**
	 * Delete review by product ID.
	 * @param {number} productId - The ID of the product for which to delete reviews.
	 * @returns {Promise<boolean>} - True if the reviews were successfully deleted, false otherwise.
	 */
	async deleteReviewsByProductId(productId: number): Promise<boolean> {
		try {
			const query = 'DELETE FROM `review` WHERE product_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [productId]);
			return results.affectedRows > 0;
		} catch (err) {
			console.error('Error deleting reviews by product ID:', err);
			throw { statusCode: 500, message: 'Failed to delete reviews.' };
		}
	}

	/**
	 * Delete review by user ID.
	 * @param {number} userId - The ID of the user for which to delete reviews.
	 * @returns {Promise<boolean>} - True if the reviews were successfully deleted, false otherwise.
	 */
	async deleteReviewsByUserId(userId: number): Promise<boolean> {
		try {
			const query = 'DELETE FROM `review` WHERE user_id =?';
			const [results]: any = await ReviewDAO.pool.query(query, [userId]);
			return results.affectedRows > 0;
		} catch (err) {
			console.error('Error deleting reviews by user ID:', err);
			throw { statusCode: 500, message: 'Failed to delete reviews.' };
		}
	}
}
