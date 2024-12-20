export async function getProductLoader() {
	const response = await fetch(`${process.env.REACT_APP_API_URL}/product`, {
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
	const response = await fetch(`${process.env.REACT_APP_API_URL}/category`, {
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

export async function getCatalogLoader({ request, params }) {
	const products = await getProductLoader();
	const categories = await getCategoriesLoader();
	return { products, categories };
}

export const LOADER_CATEGORY_DATA = 'categoryData';
