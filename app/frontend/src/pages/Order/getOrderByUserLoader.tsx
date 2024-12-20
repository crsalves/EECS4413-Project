export async function getOrderByUser({ params }) {
	const token = localStorage.getItem('token');
	const userId = params.userId;

	const response = await fetch(`${process.env.REACT_APP_API_URL}/order/user/` + userId, {
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

export async function getOrderByUserLoader({ request, params }) {
	const orders = await getOrderByUser({ params });
	return { orders };
}
