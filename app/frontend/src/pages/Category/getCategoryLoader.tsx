export async function getCategoryLoader({ params }) {
	console.log('I am calling the get category loader');

	const response = await fetch(`${process.env.REACT_APP_API_URL}/category`, {
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
