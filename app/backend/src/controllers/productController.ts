/**
 * Handles business operations to integrate database operations with endpoints.
 *
 * @file productController.ts
 * @author Carla da Silva Alves
 */
import { Product } from '../models/product/Product';
import { ProductDAO } from '../models/product/productDAO';

export class ProductController {
	private productDAO: ProductDAO;

	constructor() {
		this.productDAO = new ProductDAO();
	}

	/**
	 * @returns {Promise<Product[]>} - An array of all products in the database.
	 */
	async getProducts(): Promise<Product[]> {
		try {
			const products = await this.productDAO.selectProducts();
			return products || [];
		} catch (err) {
			console.error('Error fetching products:', err);
			throw { statusCode: 500, message: 'Failed to fetch products' };
		}
	}

	/**
	 * @param {number} id - The ID of the product.
	 * @returns {Promise<Product | null>} - The product with the specified ID or null if not found.
	 */
	async getProductById(id: number): Promise<Product | null> {
		try {
			const product = await this.productDAO.selectProductById(id);
			return product || null;
		} catch (err) {
			console.error(`Error fetching product with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch product' };
		}
	}

	/**
	 * @param {Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>} product - The product data to insert.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async createProduct(
		product: Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>
	): Promise<{ success: boolean; message: string; data?: any }> {
		try {
			const newProductId = await this.productDAO.insertProduct(product);

			if (newProductId) {
				return { success: true, message: 'Product added successfully', data: { productId: newProductId } };
			}

			return { success: false, message: 'Failed to add product' };
		} catch (err) {
			console.error('Error adding new product:', err);
			throw { statusCode: 500, message: 'Failed to add new product' };
		}
	}

	/**
	 * @param {number} id - The ID of the product to update.
	 * @param {Partial<Product>} updates - Contains fields to update in the product.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async editProductById(id: number, updates: Partial<Product>): Promise<{ success: boolean; message: string }> {
		try {
			const existingProduct = await this.getProductById(id);

			if (!existingProduct) {
				return { success: false, message: 'Product not found' };
			}

			const isUpdated = await this.productDAO.updateProductById(id, updates);

			if (isUpdated) {
				return { success: true, message: 'Product updated successfully' };
			}

			return { success: false, message: 'Failed to update product' };
		} catch (err) {
			console.error(`Error updating product with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to update product' };
		}
	}

	/**
	 * @param {number} id - The ID of the product to delete.
	 * @returns {Promise<{ success: boolean; message: string }>} - Success message or error message.
	 */
	async removeProductById(id: number): Promise<{ success: boolean; message: string }> {
		try {
			const result = await this.productDAO.deleteProductById(id);
			return result;
		} catch (err) {
			console.error(`Error deleting product with ID ${id}:`, err);
			throw { statusCode: 500, message: 'Failed to delete product' };
		}
	}

	/**
	 * @param {number} categoryId - The ID of the category.
	 * @returns {Promise<Product | null>} - The products with the specified category ID or null if not found.
	 */
	async getProductByCategoryId(categoryId: number): Promise<Product[] | null> {
		try {
			const product = await this.productDAO.selectProductByCategoryId(categoryId);
			return product || null;
		} catch (err) {
			console.error(`Error fetching product with category ID ${categoryId}:`, err);
			throw { statusCode: 500, message: 'Failed to fetch product' };
		}
	}

	async getFeaturedProducts(): Promise<Product[]> {
		try {
			const products = await this.productDAO.selectFeaturedProducts();
			return products || [];
		} catch (err) {
			console.error('Error fetching products:', err);
			throw { statusCode: 500, message: 'Failed to fetch products' };
		}
	}

	async searchProductsByKeyword(keyword: string): Promise<Product[]> {
		try {
			const products = await this.productDAO.selectProductByKeyword(keyword);
			return products || [];
		} catch (err) {
			console.error('Error searching products:', err);
			throw { statusCode: 500, message: 'Failed to search products' };
		}
	}

	async isProductAvailable(productId: number, quantity: number): Promise<boolean> {
		try {
			const product = await this.getProductById(productId);

			if (!product) {
				throw { statusCode: 404, message: 'Product not found' };
			}
			if (product.quantity < quantity) {
				throw { statusCode: 400, message: 'Not enough stock' };
			}

			return true;
		} catch (err) {
			console.error('Error checking product availability:', err);
			throw { statusCode: 500, message: 'Failed to check product availability' };
		}
	}

	async decreaseProductQuantity(productId: number, quantity: number): Promise<boolean> {
		try {
			const updatedQuantity = await this.productDAO.updateProductQuantity(productId, quantity);

			if (!updatedQuantity) {
				throw { statusCode: 400, message: 'Not enough stock' };
			}

			return true;
		} catch (err) {
			console.error('Error decreasing product quantity:', err);
			throw { statusCode: 500, message: 'Failed to decrease product quantity' };
		}
	}
}
