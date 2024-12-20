/**
 * Handles GET, POST, PUT, DELETE requests for categorys.
 *
 * @file categoryRoute.ts
 * @author Carla da Silva Alves
 */

import { Router, Request, Response } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const categoryRouter = Router();
const categoryController = new CategoryController(); // Initialize the CategoryController instance to handle category operations

/**
 * Retrieves complete information of all categories.
 *
 * @returns {Array} List of categories.
 * @throws {404} If no category is found in the database.
 */
categoryRouter.get(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const categories = await categoryController.getCategories();
		if (categories.length === 0) {
			return res.status(404).json({ message: 'No categories found in the database.' });
		}
		return res.status(200).json({ message: 'Categories retrieved successfully.', data: categories });
	})
);

/**
 * Retrieves complete information of a specific category.
 *
 * @param {number} id - The ID of the category to retrieve.
 * @returns {Category} The category with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the category is not found.
 */
categoryRouter.get(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid category ID. ID must be a positive number.' });
		}

		const category = await categoryController.getCategoryById(id);
		if (!category) {
			return res.status(404).json({ message: `Category with ID ${id} not found.` });
		}

		return res.status(200).json({ message: 'Category retrieved successfully.', data: category });
	})
);

/**
 * Adds a new category to the database.
 *
 * @param {Omit<Category, 'categoryId' | 'createdAt' | 'updatedAt'>} category - Category data to insert.
 * @returns {Object} Success message and category details.
 * @throws {400} If required fields are missing or invalid.
 */
categoryRouter.post(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const categoryData = req.body;

		if (!categoryData.name || !categoryData.description) {
			return res.status(400).json({ message: 'Invalid input: name and description are required and must be valid.' });
		}

		const result = await categoryController.createCategory(categoryData);
		return res.status(result.success ? 201 : 400).json(result);
	})
);

/**
 * Updates a category by its ID in the database.
 *
 * @param {number} id - The ID of the category to update.
 * @param {Partial<Category>} updates - Fields to update in the category.
 * @returns {Object} Success message and updated category details.
 * @throws {400} If the ID or update fields are invalid.
 * @throws {404} If the category is not found.
 */
categoryRouter.put(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		const updates = req.body;

		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid category ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await categoryController.editCategoryById(id, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

/**
 * Deletes a category by its ID from the database.
 *
 * @param {number} id - The ID of the category to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the category is not found.
 */
categoryRouter.delete(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid category ID.' });
		}

		const result = await categoryController.removeCategoryById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);
