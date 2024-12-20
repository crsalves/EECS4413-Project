export async function getProductByCategory({ params }) {
	const categoryId = params.categoryId;

	const response = await fetch(`${window.config.apiUrl}/product/category/${categoryId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (response.ok) {
		return response.json();
	}

	throw new Error('Api error');
}

export async function getCategoriesLoader() {
	const response = await fetch(`${window.config.apiUrl}/category`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (response.ok) {
		return response.json();
	}
	throw new Error('Failed to fetch categories');
}

export async function getProductByCategoryLoader({ request, params }) {
	const products = await getProductByCategory({ params });
	const categories = await getCategoriesLoader();
	return { products, categories };
}

export const LOADER_PRODUCT_BY_CATEGORY = 'productByCategory';
