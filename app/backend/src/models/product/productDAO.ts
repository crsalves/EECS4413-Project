/**
 * Handles database interactions to perform CRUD operations for the Product entity.
 *
 * @file ProductDAO.ts
 * @description Data Access Object (DAO) for products.
 * @author Carla da Silva Alves
 */
import { getConnectionPool } from '../../config/dbConnection';
import { Pool } from 'mysql2/promise';
import { Product } from './Product';

export class ProductDAO {
	private static pool: Pool;
	static async init() {
        ProductDAO.pool = await getConnectionPool();
    }

	/**
	 * Reads all products from the database.
	 *
	 * @returns {Promise<Product[]>} - An array of all products in the database.
	 */
	async selectProducts(): Promise<Product[]> {
		try {
			const query = 'SELECT * FROM `product`';
			const [results]: any = await ProductDAO.pool.query(query);

			return results.map((row: any) => ({
				productId: row.product_id,
				name: row.name,
				description: row.description,
				brand: row.brand,
				model: row.model,
				categoryId: row.category_id,
				price: row.price,
				quantity: row.quantity,
				imageUrl: row.image_url,
				isFeatured: !!row.is_featured,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error('Error fetching products:', err);
			throw { statusCode: 500, message: 'Failed to fetch products.' };
		}
	}

	/**
	 * Reads a single product by its ID.
	 *
	 * @param {number} id - The ID of the product.
	 * @returns {Promise<Product | null>} - The product with the specified ID or null if not found.
	 */
	async selectProductById(id: number): Promise<Product | null> {
		try {
			const query = 'SELECT * FROM `product` WHERE product_id = ?';
			const [results]: any = await ProductDAO.pool.query(query, [id]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				productId: row.product_id,
				name: row.name,
				description: row.description,
				brand: row.brand,
				model: row.model,
				categoryId: row.category_id,
				price: row.price,
				quantity: row.quantity,
				imageUrl: row.image_url,
				isFeatured: !!row.is_featured,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			};
		} catch (err) {
			console.error(`Error fetching product with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch product by ID.' };
		}
	}

	/**
	 * Creates a new product into the database.
	 *
	 * @param {Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>} product - The product object to insert.
	 * @returns {Promise<number>} - The ID of the newly inserted product.
	 */
	async insertProduct(product: Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>): Promise<number> {
		try {
			const query = `
        INSERT INTO product
        (name, description, brand, model, category_id, price, quantity, image_url, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

			const [results]: any = await ProductDAO.pool.query(query, [
				product.name,
				product.description,
				product.brand,
				product.model,
				product.categoryId,
				product.price,
				product.quantity,
				product.imageUrl,
				product.isFeatured
			]);

			return results.insertId;
		} catch (err) {
			console.error('Error inserting new product:', err);
			throw { statusCode: 500, message: 'Failed to insert product.' };
		}
	}

	/**
	 * Updates an existing product in the database.
	 *
	 * @param {number} id - The ID of the product to update.
	 * @param {Partial<Product>} product - The fields to update.
	 * @returns {Promise<boolean>} - True if the product was successfully updated, false otherwise.
	 */
	async updateProductById(id: number, product: Partial<Product>): Promise<boolean> {
		try {
			// COALESCE() is used to keep the current value if the new value is null
			const query = `
        UPDATE product
        SET name = COALESCE(?, name),
            description = COALESCE(?, description),
            brand = COALESCE(?, brand),
            model = COALESCE(?, model),
            category_id = COALESCE(?, category_id),
            price = COALESCE(?, price),
            quantity = COALESCE(?, quantity),
            image_url = COALESCE(?, image_url),
            is_featured = COALESCE(?, is_featured)
        WHERE product_id = ?
      `;
			const [results]: any = await ProductDAO.pool.query(query, [
				product.name,
				product.description,
				product.brand,
				product.model,
				product.categoryId,
				product.price,
				product.quantity,
				product.imageUrl,
				product.isFeatured,
				id
			]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating product with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update product.' };
		}
	}

	/**
	 * Deletes a product from the database by its ID.
	 *
	 * @param {number} id - The ID of the product to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - The result of the deletion.
	 */
	async deleteProductById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM product WHERE product_id = ?';
			const [results]: any = await ProductDAO.pool.query(query, [id]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'Product deleted successfully.' };
			}

			return { success: false, message: 'Product not found.' };
		} catch (err: any) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				return {
					success: false,
					message: 'Failed to delete product due to dependencies.'
				};
			}

			console.error(`Unexpected error during deletion of product with ID ${id}:`, err);
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the product.'
			};
		}
	}

	/**
	 * Reads a single product by its ID.
	 *
	 * @param {number} categoryId - The ID of the product.
	 * @returns {Promise<Product[] | null>} - The product with the specified ID or null if not found.
	 */
	async selectProductByCategoryId(categoryId: number): Promise<Product[] | null> {
		try {
			const query = 'SELECT * FROM `product` WHERE category_id = ?';
			const [results]: any = await ProductDAO.pool.query(query, [categoryId]);

			if (results.length === 0) return [];

			return results.map((row: any) => ({
				productId: row.product_id,
				name: row.name,
				description: row.description,
				brand: row.brand,
				model: row.model,
				categoryId: row.category_id,
				price: row.price,
				quantity: row.quantity,
				imageUrl: row.image_url,
				isFeatured: !!row.is_featured,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error(`Error fetching product with category ID ${categoryId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch product by category ID.' };
		}
	}

	/**
	 * Reads all featured products from the database.
	 *
	 * @returns {Promise<Product[]>} - An array of all featured products in the database.
	 */
	async selectFeaturedProducts(): Promise<Product[]> {
		try {
			const query = 'SELECT * FROM `product` WHERE is_featured = 1';
			const [results]: any = await ProductDAO.pool.query(query);

			return results.map((row: any) => ({
				productId: row.product_id,
				name: row.name,
				description: row.description,
				brand: row.brand,
				model: row.model,
				categoryId: row.category_id,
				price: row.price,
				quantity: row.quantity,
				imageUrl: row.image_url,
				isFeatured: !!row.is_featured,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error('Error fetching featured products:', err);
			throw { statusCode: 500, message: 'Failed to fetch featured products.' };
		}
	}

	async selectProductByKeyword(keyword: string): Promise<Product[]> {
		try {
			const query = 'SELECT * FROM `product` WHERE name LIKE ? OR description LIKE ? OR brand LIKE ?';

			const [results]: any = await ProductDAO.pool.query(query, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);

			return results.map((row: any) => ({
				productId: row.product_id,
				name: row.name,
				description: row.description,
				brand: row.brand,
				model: row.model,
				categoryId: row.category_id,
				price: row.price,
				quantity: row.quantity,
				imageUrl: row.image_url,
				isFeatured: !!row.is_featured,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			}));
		} catch (err) {
			console.error('Error searching products:', err);
			throw { statusCode: 500, message: 'Failed to search products.' };
		}
	}

	async updateProductQuantity(productId: number, quantity: number): Promise<boolean> {
		try {
			const query = 'UPDATE product SET quantity = ? WHERE product_id = ?';
			const [results]: any = await ProductDAO.pool.query(query, [quantity, productId]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating product quantity with ID ${productId}:`, err);
			throw { statusCode: 500, message: 'Failed to update product quantity.' };
		}
	}

	async selectProductsByIds(productIds: number[]): Promise<{ productId: number; quantity: number }[]> {
		try {
			const placeholders = productIds.map(() => '?').join(',');
			const query = `SELECT product_id AS productId, quantity FROM product WHERE product_id IN (${placeholders})`;
			const [results]: any = await ProductDAO.pool.query(query, productIds);
			return results;
		} catch (err) {
			console.error('Error fetching products by IDs:', err);
			throw { statusCode: 500, message: 'Failed to fetch products.' };
		}
	}
}
