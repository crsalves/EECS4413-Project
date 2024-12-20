/**
 * Represents the API's category by implementing the interface.
 * @file CategoryModel.ts
 */

import { Category } from './Category';

export class CategoryModel implements CategoryModel {
	categoryId: number;
	name: string;
	description: string | null;

	/**
	 * Constructs a new categoryModel object.
	 * @param {Category} category - The category details.
	 */
	constructor(category: Category) {
		this.categoryId = category.categoryId;
		this.name = category.name;
		this.description = category.description;
	}

	// Getters
	getCategoryId(): number {
		return this.categoryId;
	}

	getName(): string {
		return this.name;
	}

	// Setters
	setCategoryId(categoryId: number): void {
		this.categoryId = categoryId;
	}

	setName(name: string): void {
		this.name = name;
	}

	setDescription(description: string | null): void {
		this.description = description;
	}

	/**
	 * @returns {string} of the object's attributes.
	 */
	public toString(): string {
		return `Category ID: ${this.categoryId}, Name: ${this.name}, Description: ${this.description}`;
	}
}
