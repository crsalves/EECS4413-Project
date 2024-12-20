export async function getOrders() {
	const token = localStorage.getItem('token');

	const response = await fetch(`${process.env.REACT_APP_API_URL}/order`, {
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

export async function getOrdersLoader() {
	const orders = await getOrders();

	console.log('Retrieve Orders:', orders);
	return { orders };
}
