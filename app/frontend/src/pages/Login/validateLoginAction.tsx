export async function validateLoginAction({ request, params }) {
	const method = request.method; // POST
	const data = await request.formData();
	const loginData = {
		email: data.get('email'),
		password: data.get('password')
	};

	const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
		method: method,
		body: JSON.stringify(loginData),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw Error('Could not save event.');
	}

	return response;
}
