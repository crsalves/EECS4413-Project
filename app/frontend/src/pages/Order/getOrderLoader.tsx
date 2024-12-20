export async function getOrder({ params }) {
	const token = localStorage.getItem('token');
	const orderId = params.orderId;

	const response = await fetch(`${process.env.REACT_APP_API_URL}/order/` + orderId, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token!
		}
	});

	if (response.ok) {
		return response.json();
	}
	throw new Error('Failed to fetch orders');
}

export async function getOrderLoader({ params }) {
	const order = await getOrder({ params });
	return { order };
}
