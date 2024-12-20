/**
 * Wishlist interface for the database.
 * @file review.ts
 * @author Carla da Silva Alves
 */
export interface Review {
  reviewId: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  date: Date;
}