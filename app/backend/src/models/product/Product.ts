/**
 * Product interface for the database.
 * @file Product.ts
 * @author Carla da Silva Alves
 */
export interface Product {
	productId: number;
	name: string;
	description: string | null;
	brand: string | null;
	model: string | null;
	categoryId: number | null;
	price: number;
	quantity: number;
	imageUrl: string | null;
	isFeatured: boolean;
	createdAt: Date;
	updatedAt: Date;
}
