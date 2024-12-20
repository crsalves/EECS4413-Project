export async function getAddressLoader(userId) {
	const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/address`, {
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

export async function getCheckoutDataLoader({ request, params }) {
	const userId = params.userId;
	const addresses = await getAddressLoader(userId);

	return { addresses };
}

export const LOADER_GET_CHECKOUT_DATA = 'LOADER_GET_CHECKOUT_DATA';
