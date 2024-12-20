export async function addRegistrationAction({ request, params }) {
	console.log('addRegistrationAction', request, params);
	const method = request.method; // POST
	const data = await request.formData();
	const registration = {
		name: data.get('name'),
		email: data.get('email'),
		password: data.get('password'),
		phone: data.get('phone'),
		address_street: data.get('street'),
		address_complement: data.get('complement'),
		address_province: data.get('province'),
		address_country: data.get('country'),
		address_postal_code: data.get('postal_code'),
		role: ''
	};

	const response = await fetch(`${window.config.apiUrl}/user`, {
		method: method,
		body: JSON.stringify(registration),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		return await response.json();
	} else {
		const errorResponse = await response.json();
		console.log('Failed to register user: ', errorResponse.message);
		return { status: 500, message: errorResponse.message };
	}
}
