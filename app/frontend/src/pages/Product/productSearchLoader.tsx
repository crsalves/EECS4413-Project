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

export async function getProductLoader({ request, params }) {
	const query = params.query;

	console.log('This is the query in the loader', query);

	if (!query) return { products: [], query: '' };

	const response = await fetch(`${process.env.REACT_APP_API_URL}/product/search/${query}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) throw new Error('Failed to fetch search results');

	const productsData = await response.json();

	return productsData;
}

export async function productSearchLoader({ request, params }) {
	const query = params.query;

	console.log('This is the query in the loader', query);
	const products = await getProductLoader({ request, params });
	const categories = await getCategoriesLoader();
	return { products, categories, query };
}

export const LOADER_PRODUCT_SEARCH = 'productSearch';
