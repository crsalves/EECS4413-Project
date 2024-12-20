/**
 * Represents the API's wishlist by implementing the interface.
 * @file WishlistModel.ts
 */

import { Wishlist } from './Wishlist';

export class WishlistModel implements Wishlist {
    wishlistId: number;
    userId: number;
    productId: number;
    createdAt: Date;

    /**
     * Constructs a new wishlistModel object.
     * @param {Wishlist} wishlist - The wishlist details.
     */
    constructor(wishlist: Wishlist) {
        this.wishlistId = wishlist.wishlistId;
        this.userId = wishlist.userId;
        this.productId = wishlist.productId;
        this.createdAt = wishlist.createdAt;
    }

    // Getters
    getId(): number {
        return this.wishlistId;
    }
    getUserId(): number {
        return this.userId;
    }
    getProductId(): number {
        return this.productId;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    // Setters
    setId(id: number): void {
        this.wishlistId = id;
    }
    setUserId(userId: number): void {
        this.userId = userId;
    }
    setProductId(productId: number): void {
        this.productId = productId;
    }
    setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }
    /**
     * @returns {string} of the object's attributes.
     */
    public toString(): string {
        return `Wishlist ID: ${this.wishlistId}, User ID: ${this.userId}, Product ID: ${this.productId}, Created At: ${this.createdAt}`;
    }
}