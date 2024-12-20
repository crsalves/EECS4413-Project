/**
 * Wishlist interface for the database.
 * @file Wishlist.ts
 * @author Carla da Silva Alves
 */
export interface Wishlist {
  wishlistId: number;
  userId: number;
  productId: number;
  createdAt: Date;
}