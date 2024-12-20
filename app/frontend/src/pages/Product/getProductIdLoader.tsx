export async function getProductId({ params }) {
	const productId = params.productId;

	const response = await fetch(`${window.config.apiUrl}/product/${productId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error('Api error');
	} else {
		return response.json();
	}
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

export async function getProductIdLoader({ request, params }) {
	const product = await getProductId({ params });
	const categories = await getCategoriesLoader();
	return { product, categories };
}

export const LOADER_PRODUCT_ID = 'productDetail';
