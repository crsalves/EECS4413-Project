export async function getCategoryLoader({ params }) {
	console.log('I am calling the get category loader');

	const response = await fetch(`${window.config.apiUrl}/category`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error('Api error');
	} else {
		return response;
	}
}
export const LOADER_CATEGORY = 'category';
