/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file reviewController.ts
 * @author Carla da Silva Alves
 */
import { Review } from '../models/review/Review';
import { ReviewDAO } from '../models/review/reviewDAO';

export class ReviewController {
	private reviewDAO: ReviewDAO;

	constructor() {
		this.reviewDAO = new ReviewDAO();
	}

	/**
	 * @returns {Promise<Review[]>} - An array of all reviews in the database.
	 */
	async getReviews(): Promise<Review[]> {
		try {
			const reviews = await this.reviewDAO.selectReviews();
			return reviews || [];
		} catch (err) {
			console.error('Error fetching reviews:', err);
			throw { statusCode: 500, message: 'Failed to fetch reviews' };
		}
	}

	/**
	 * @param {number} id - The ID of the review.
	 * @returns {Promise<Review | null>} - The review with the specified ID or null if not found.
	 */
	async getReviewById(id: number): Promise<Review | null> {
		try {
			const review = await this.reviewDAO.selectReviewById(id);
			return review || null;
		} catch (err) {
			console.error(`Error fetching review with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch review' };
		}
	}

	/**
	 * @param {number} id - The ID of the review
	 * @returns {Promise<Review[]>} - An array of all reviews for the specified product.
	 */
	async getReviewsByProductId(productId: number): Promise<Review[]> {
		try {
			const reviews = await this.reviewDAO.selectReviewsByProductId(productId);
			return reviews || [];
		} catch (err) {
			console.error(`Error fetching reviews for product with ID ${productId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch reviews' };
		}
	}

	/**
	 * @param {number} id - The ID of the review
	 * @returns {Promise<Review[]>} - An array of all reviews for the specified user.
	 */
	async getReviewsByUserId(userId: number): Promise<Review[]> {
		try {
			const reviews = await this.reviewDAO.selectReviewsByUserId(userId);
			return reviews || [];
		} catch (err) {
			console.error(`Error fetching reviews for user with ID ${userId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch reviews' };
		}
	}

	/**
	 * @param {number} reviewId - The ID of the review to update.
	 * @param {Partial<Review>} updatedReview - The updated review data.
	 * @returns {Promise<boolean>} - True if the review was updated, false otherwise.
	 */
	async updateReview(reviewId: number, updatedReview: Partial<Review>): Promise<boolean> {
		try {
			const updated = await this.reviewDAO.updateReview(reviewId, updatedReview);
			return updated;
		} catch (err) {
			console.error(`Error updating review with ID ${reviewId}:`, err);
			throw { statusCode: 500, message: 'Failed to update review' };
		}
	}

	/**
	 * @param {number} reviewId - The ID of the review to delete.
	 * @returns {Promise<boolean>} - True if the review was deleted, false otherwise.
	 */
	async deleteReview(reviewId: number): Promise<boolean> {
		try {
			const deleted = await this.reviewDAO.deleteReview(reviewId);
			return deleted;
		} catch (err) {
			console.error(`Error deleting review with ID ${reviewId}:`, err);
			throw { statusCode: 500, message: 'Failed to delete review' };
		}
	}

	/**
	 * @param {number} productId - The ID of the product whose reviews to delete.
	 * @returns {Promise<boolean>} - True if the reviews were deleted, false otherwise.
	 */
	async deleteReviewsByProductId(productId: number): Promise<boolean> {
		try {
			const deleted = await this.reviewDAO.deleteReviewsByProductId(productId);
			return deleted;
		} catch (err) {
			console.error(`Error deleting reviews for product with ID ${productId}:`, err);
			throw { statusCode: 500, message: 'Failed to delete reviews' };
		}
	}

	/**
	 * @param {number} userId - The ID of the user whose reviews to delete.
	 * @returns {Promise<boolean>} - True if the reviews were deleted, false otherwise.
	 */
	async deleteReviewsByUserId(userId: number): Promise<boolean> {
		try {
			const deleted = await this.reviewDAO.deleteReviewsByUserId(userId);
			return deleted;
		} catch (err) {
			console.error(`Error deleting reviews for user with ID ${userId}:`, err);
			throw { statusCode: 500, message: 'Failed to delete reviews' };
		}
	}

	// to find the average rating for a product:
	async getAverageRating(productId: number): Promise<number> {
		try {
			const reviews = await this.reviewDAO.selectReviewsByProductId(productId);
			if (reviews.length === 0) {
				return 0;
			}
			const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
			return totalRating / reviews.length;
		} catch (err) {
			console.error(`Error fetching average rating for product with ID ${productId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch average rating' };
		}
	}
}
