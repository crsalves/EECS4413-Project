export async function getProfileAddressLoader({ params }) {
	const token = localStorage.getItem('token');

	const userId = params.userId;
	const response = await fetch(`${window.config.apiUrl}/user/${userId}/address`, {
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
