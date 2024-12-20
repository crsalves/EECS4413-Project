/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file categoryController.ts
 * @author Carla da Silva Alves
 */
import { Category } from '../models/category/Category';
import { CategoryDAO } from '../models/category/categoryDAO';



export class CategoryController {
	private categoryDAO: CategoryDAO;

	constructor() {
		this.categoryDAO = new CategoryDAO();
	}

	/**
	 * @returns {Promise<Category[]>} - An array of all category in the database.
	 */
	async getCategories(): Promise<Category[]> {
		try {
			const category = await this.categoryDAO.selectCategories();
			return category || [];
		} catch (err) {
			console.error('Error fetching category:', err);
			throw { statusCode: 500, message: 'Failed to fetch category' };
		}
	}

	/**
	 * @param {number} id - The ID of the category.
	 * @returns {Promise<Category | null>} - The category with the specified ID or null if not found.
	 */
	async getCategoryById(id: number): Promise<Category | null> {
		try {
			const category = await this.categoryDAO.selectCategoryById(id);
			return category || null;
		} catch (err) {
			console.error(`Error fetching category with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch category' };
		}
	}

	/**
	 * @param {Omit<Category, 'categoryId' | 'createdAt' | 'updatedAt'>} category - The category data to insert.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async createCategory(
		category: Omit<Category, 'categoryId' | 'createdAt' | 'updatedAt'>
	): Promise<{ success: boolean; message: string }> {
		try {
			const newCategoryId = await this.categoryDAO.insertCategory(category);

			if (newCategoryId) {
				return { success: true, message: 'Category added successfully' };
			}

			return { success: false, message: 'Failed to add category' };
		} catch (err) {
			console.error('Error adding new category:', err);
			throw { statusCode: 500, message: 'Failed to add new category' };
		}
	}

	/**
	 * @param {number} id - The ID of the category to update.
	 * @param {Partial<Category>} updates - Contains fields to update in the category.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async editCategoryById(id: number, updates: Partial<Category>): Promise<{ success: boolean; message: string }> {
		try {
			const existingCategory = await this.getCategoryById(id);

			if (!existingCategory) {
				return { success: false, message: 'Category not found' };
			}

			const isUpdated = await this.categoryDAO.updateCategoryById(id, updates);

			if (isUpdated) {
				return { success: true, message: 'Category updated successfully' };
			}

			return { success: false, message: 'Failed to update category' };
		} catch (err) {
			console.error(`Error updating category with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update category' };
		}
	}

	/**
	 * @param {number} id - The ID of the category to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async removeCategoryById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.categoryDAO.deleteCategoryById(id);
			return result;
		} catch (err) {
			console.error(`Error deleting category with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete category' };
		}
	}
}
