export async function getProfilesLoader({ request, params }) {
	const token = localStorage.getItem('token');

	const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token!
		}
	});

	if (!response.ok) {
		throw new Error('Api error');
	} else {
		console.log('this is the response of get user', response);
		return response;
	}
}
