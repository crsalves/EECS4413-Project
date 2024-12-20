export async function getProductId({ params }) {
	const productId = params.productId;

	const response = await fetch(`${process.env.REACT_APP_API_URL}/product/${productId}`, {
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

export async function getProductIdLoader({ request, params }) {
	const product = await getProductId({ params });
	const categories = await getCategoriesLoader();
	return { product, categories };
}

export const LOADER_PRODUCT_ID = 'productDetail';
