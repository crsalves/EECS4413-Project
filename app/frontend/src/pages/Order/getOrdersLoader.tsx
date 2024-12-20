export async function getOrders() {
	const token = localStorage.getItem('token');

	const response = await fetch(`${window.config.apiUrl}/order`, {
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
