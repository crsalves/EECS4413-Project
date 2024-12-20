/**
 * Represents the API's product by implementing the interface.
 * @file ProductModel.ts
 */

import { Product } from './Product';

export class ProductModel implements Product {
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

	/**
	 * Constructs a new productModel object.
	 * @param {Product} product - The product details.
	 */
	constructor(product: Product) {
		this.productId = product.productId;
		this.name = product.name;
		this.description = product.description;
		this.brand = product.brand;
		this.model = product.model;
		this.categoryId = product.categoryId;
		this.price = product.price;
		this.quantity = product.quantity;
		this.imageUrl = product.imageUrl;
		this.isFeatured = product.isFeatured;
		this.createdAt = product.createdAt;
		this.updatedAt = product.updatedAt;
	}

	// Getters
	getProductId(): number {
		return this.productId;
	}

	getName(): string {
		return this.name;
	}

	getDescription(): string | null {
		return this.description;
	}

	getBrand(): string | null {
		return this.brand;
	}

	getModel(): string | null {
		return this.model;
	}

	getCategoryId(): number | null {
		return this.categoryId;
	}

	getPrice(): number {
		return this.price;
	}

	getQuantity(): number {
		return this.quantity;
	}

	getImageUrl(): string | null {
		return this.imageUrl;
	}

	isProductFeatured(): boolean {
		return this.isFeatured;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}

	// Setters
	setProductId(productId: number): void {
		this.productId = productId;
	}

	setName(name: string): void {
		this.name = name;
	}

	setDescription(description: string | null): void {
		this.description = description;
	}

	setBrand(brand: string | null): void {
		this.brand = brand;
	}

	setModel(model: string | null): void {
		this.model = model;
	}

	setCategoryId(categoryId: number | null): void {
		this.categoryId = categoryId;
	}

	setPrice(price: number): void {
		this.price = price;
	}

	setQuantity(quantity: number): void {
		this.quantity = quantity;
	}

	setImageUrl(imageUrl: string | null): void {
		this.imageUrl = imageUrl;
	}

	setIsFeatured(isFeatured: boolean): void {
		this.isFeatured = isFeatured;
	}

	setCreatedAt(createdAt: Date): void {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt: Date): void {
		this.updatedAt = updatedAt;
	}

	/**
	 * @returns {string} of the object's attributes.
	 */
	public toString(): string {
		return `Product ID: ${this.productId}, Name: ${this.name}, Price: ${this.price}, Quantity: ${this.quantity}, Created At: ${this.createdAt}, Updated At: ${this.updatedAt}, Is Featured: ${this.isFeatured}, Category ID: ${this.categoryId}, Brand: ${this.brand}, Model: ${this.model}, Description: ${this.description}, Image URL: ${this.imageUrl}`;
	}
}
