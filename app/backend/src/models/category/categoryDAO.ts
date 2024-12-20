/**
 * Handles database interactions to perform CRUD operations for the category entity.
 *
 * @file CategoryDAO.ts
 * @description Data Access Object (DAO) for categories.
 * @author Carla da Silva Alves
 */
import { getConnectionPool } from '../../config/dbConnection';
import { Pool } from 'mysql2/promise';
import { Category } from './Category';

export class CategoryDAO {
	private static pool: Pool;

	static async init() {
		CategoryDAO.pool = await getConnectionPool();
	}

	/**
	 * Reads all categories from the database.
	 *
	 * @returns {Promise<Category[]>} - An array of all categories in the database.
	 */
	async selectCategories(): Promise<Category[]> {
		try {
			const query = 'SELECT * FROM `category`';
			const [results]: any = await CategoryDAO.pool.query(query);

			return results.map((row: any) => ({
				categoryId: row.category_id,
				name: row.name,
				description: row.description
			}));
		} catch (err) {
			console.error('Error fetching categories:', err);
			throw { statusCode: 500, message: 'Failed to fetch categories.' };
		}
	}

	/**
	 * Reads a single category by its ID.
	 *
	 * @param {number} id - The ID of the category.
	 * @returns {Promise<Category | null>} - The category with the specified ID or null if not found.
	 */
	async selectCategoryById(id: number): Promise<Category | null> {
		try {
			const query = 'SELECT * FROM `category` WHERE category_id = ?';
			const [results]: any = await CategoryDAO.pool.query(query, [id]);

			if (results.length === 0) return null;

			const row = results[0];
			return {
				categoryId: row.category_id,
				name: row.name,
				description: row.description
			};
		} catch (err) {
			console.error(`Error fetching category with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch category by ID.' };
		}
	}

	/**
	 * Creates a new category into the database.
	 *
	 * @param {Omit<Category, 'categoryId'>} category - The category object to insert.
	 * @returns {Promise<number>} - The ID of the newly inserted category.
	 */
	async insertCategory(category: Omit<Category, 'categoryId'>): Promise<number> {
		try {
			const query = 'INSERT INTO `category` (name, description) VALUES (?,?)';

			const [results]: any = await CategoryDAO.pool.query(query, [category.name, category.description]);

			return results.insertId;
		} catch (err) {
			console.error('Error inserting new category:', err);
			throw { statusCode: 500, message: 'Failed to insert category.' };
		}
	}

	/**
	 * Updates an existing category in the database.
	 *
	 * @param {number} id - The ID of the categoory to update.
	 * @param {Partial<Category>} category - The fields to update.
	 * @returns {Promise<boolean>} - True if the category was successfully updated, false otherwise.
	 */
	async updateCategoryById(id: number, category: Partial<Category>): Promise<boolean> {
		try {
			// COALESCE() is used to keep the current value if the new value is null
			const query =
				'UPDATE `category` SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE category_id = ?';
			const [results]: any = await CategoryDAO.pool.query(query, [category.name, category.description, id]);

			return results.affectedRows > 0;
		} catch (err) {
			console.error(`Error updating category with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update category.' };
		}
	}

	/**
	 * Deletes a category from the database by its ID.
	 *
	 * @param {number} id - The ID of the category to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - The result of the deletion.
	 */
	async deleteCategoryById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const query = 'DELETE FROM `category` WHERE category_id = ?';
			const [results]: any = await CategoryDAO.pool.query(query, [id]);

			if (results.affectedRows > 0) {
				return { success: true, message: 'Category deleted successfully.' };
			}

			return { success: false, message: 'Category not found.' };
		} catch (err: any) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				return {
					success: false,
					message: 'Failed to delete category due to dependencies.'
				};
			}

			console.error(`Unexpected error during deletion of category with ID ${id}:`, err);
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the category.'
			};
		}
	}
}
