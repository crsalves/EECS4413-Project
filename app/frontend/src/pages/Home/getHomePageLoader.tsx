export async function getCategoriesLoader() {
	console.log('API_URL at home page', process.env.REACT_APP_API_URL);

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

export async function getHomePageLoader({ request, params }) {
	const categories = await getCategoriesLoader();
	return { categories };
}

export const LOADER_HOME_PAGE = 'homePage';