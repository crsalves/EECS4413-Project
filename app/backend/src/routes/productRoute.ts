/**
 * Handles GET, POST, PUT, DELETE requests for products.
 *
 * @file productRoute.ts
 * @author Carla da Silva Alves
 */

import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/productController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const productRouter = Router();
const productController = new ProductController(); // Initialize the ProductController instance to handle product operations

/**
 * Retrieves complete information of all products.
 *
 * @returns {Array} List of products.
 * @throws {404} If no products are found in the database.
 */
productRouter.get(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const products = await productController.getProducts();
		if (products.length === 0) {
			return res.status(404).json({ message: 'No products found in the database.' });
		}
		return res.status(200).json({ message: 'Products retrieved successfully.', data: products });
	})
);

/**
 * Retrieves complete information of a specific product.
 *
 * @param {number} id - The ID of the product to retrieve.
 * @returns {Product} The product with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the product is not found.
 */
productRouter.get(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid product ID. ID must be a positive number.' });
		}

		const product = await productController.getProductById(id);
		if (!product) {
			return res.status(404).json({ message: `Product with ID ${id} not found.` });
		}

		return res.status(200).json({ message: 'Product retrieved successfully.', data: product });
	})
);

/**
 * Adds a new product to the database.
 *
 * @param {Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>} product - Product data to insert.
 * @returns {Object} Success message and product details.
 * @throws {400} If required fields are missing or invalid.
 */
productRouter.post(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		const productData = req.body;

		if (!productData.name || typeof productData.price !== 'number' || typeof productData.quantity !== 'number') {
			return res
				.status(400)
				.json({ message: 'Invalid input: name, price, and quantity are required and must be valid.' });
		}

		const result = await productController.createProduct(productData);
		return res.status(result.success ? 201 : 400).json(result);
	})
);

/**
 * Updates a product by its ID in the database.
 *
 * @param {number} id - The ID of the product to update.
 * @param {Partial<Product>} updates - Fields to update in the product.
 * @returns {Object} Success message and updated product details.
 * @throws {400} If the ID or update fields are invalid.
 * @throws {404} If the product is not found.
 */
productRouter.put(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		const updates = req.body;

		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid product ID.' });
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'At least one field is required to update.' });
		}

		const result = await productController.editProductById(id, updates);
		return res.status(result.success ? 200 : 404).json(result);
	})
);

/**
 * Deletes a product by its ID from the database.
 *
 * @param {number} id - The ID of the product to delete.
 * @returns {Object} Success message or error message.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the product is not found.
 */
productRouter.delete(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({ message: 'Invalid product ID.' });
		}

		const result = await productController.removeProductById(id);
		return res.status(result.success ? 200 : 404).json(result);
	})
);


/**
 * Retrieves complete information of a specific product.
 *
 * @param {number} id - The ID of the product to retrieve.
 * @returns {Product} The product with the specified ID.
 * @throws {400} If the ID is invalid.
 * @throws {404} If the product is not found.
 */
productRouter.get(
	'/category/:category_id',
	asyncHandler(async (req: Request, res: Response) => {
		const categoryId = parseInt(req.params.category_id, 10);
		if (isNaN(categoryId) || categoryId <= 0) {
			return res.status(400).json({ message: 'Invalid category ID. ID must be a positive number.' });
		}

		const product = await productController.getProductByCategoryId(categoryId);
		if (!product) {
			return res.status(404).json({ message: `Products with Category ID ${categoryId} not found.` });
		}

		return res.status(200).json({ message: 'Products retrieved successfully.', data: product });
	})
);

/**
 * Retrieves products by keywords.
 *
 * @param {string} keywords - Comma-separated keywords to search for in product names.
 * @returns {Array} List of products that match the keywords.
 * @throws {400} If no keywords are provided.
 *
 */
productRouter.get('/search/:keyword', asyncHandler(async (req: Request, res: Response) => {
	const keyword = req.params.keyword.trim();
    if (keyword.length === 0) {
        return res.status(400).json({ message: 'No keyword provided for search.' });
    }

    const products = await productController.searchProductsByKeyword(keyword);
    if (products.length === 0) {
        return res.status(404).json({ message: 'No products found matching the provided keyword.' });
    }

    return res.status(200).json({ message: 'Products retrieved successfully.', data: products });
}));