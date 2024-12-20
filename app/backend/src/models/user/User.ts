/**
 * User interface for the database.
 * @file User.ts
 * @author Carla da Silva Alves
 */
export interface User {
	userId?: number;
	name: string;
	email: string;
	passwordHash: string;
	phone?: string;
	addressStreet?: string;
	addressComplement?: string;
	addressProvince?: string;
	addressCountry?: string;
	addressPostalCode?: string;
	role?: 'customer' | 'admin';
	createdAt?: Date;
	updatedAt?: Date;
}
