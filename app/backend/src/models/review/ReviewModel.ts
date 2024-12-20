/**
 * Represents the API's review by implementing the interface.
 * @file reviewModel.ts
 */

import { Review } from './Review';

export class ReviewModel implements Review {
    public reviewId: number;
    public userId: number;
    public productId: number;
    public rating: number;
    public comment: string;
    public date: Date;

    /**
     * Constructs a new reviewModel object.
     * @param {Review} review - The review details.
     *
     */
    constructor(review: Review) {
        this.reviewId = review.reviewId;
        this.userId = review.userId;
        this.productId = review.productId;
        this.rating = review.rating;
        this.comment = review.comment;
        this.date = review.date;
    }
    title: string;
    // Getters
    getReviewId(): number {
        return this.reviewId;
    }
    getUserId(): number {
        return this.userId;
    }
    getProductId(): number {
        return this.productId;
    }
    getRating(): number {
        return this.rating;
    }
    getComment(): string {
        return this.comment;
    }
    getDate(): Date {
        return this.date;
    }
    // Setters
    setReviewId(reviewId: number): void {
        this.reviewId = reviewId;
    }
    setUserId(userId: number): void {
        this.userId = userId;
    }
    setProductId(productId: number): void {
        this.productId = productId;
    }
    setRating(rating: number): void {
        this.rating = rating;
    }
    setComment(comment: string): void {
        this.comment = comment;
    }
    setDate(date: Date): void {
        this.date = date;
    }

    /**
     * @returns {string} of the object's attributes.
     */
    public toString(): string {
        return `Review ID: ${this.reviewId}, User ID: ${this.userId}, Product ID: ${this.productId}, Rating: ${this.rating}, Comment: ${this.comment}, Date: ${this.date}`;
    }
}