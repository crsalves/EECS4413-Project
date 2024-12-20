/**
 * Category interface for the database.
 * @file Category.ts
 * @author Carla da Silva Alves
 */
export interface Category {
	categoryId: number;
	name: string;
	description: string | null;
}
