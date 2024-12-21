import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { useState } from 'react';

export default function RegistrationContactPage({ contactData, handleAddContact }) {
	const [contactInfo, setContactInfo] = useState(contactData);
	const [errors, setErrors] = useState({ email: '', phone: '', password: '' });

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setContactInfo({ ...contactInfo, [name]: value });

		// Validation logic
		if (name === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			setErrors({ ...errors, email: emailRegex.test(value) ? '' : 'Invalid email address' });
		}

		// Validation logic for phone number
		if (name === 'phone') {
			const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
			setErrors({
				...errors,
				phone: phoneRegex.test(value) ? '' : 'Invalid phone number format. Expected format: 655-643-2210'
			});
		}

		// Validation logic for password
		if (name === 'password') {
			const passwordRegex = /^(?=.*\d).{6,}$/;
			setErrors({
				...errors,
				password: passwordRegex.test(value)
					? ''
					: 'Password must be at least 6 characters long and contain at least one number'
			});
		}
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Register Your Account
			</Typography>
			<Typography variant="h6" gutterBottom>
				Enter Your Contact Information
			</Typography>
			<Card variant="outlined">
				<CardContent>
					<TextField
						fullWidth
						margin="normal"
						label="First Name"
						variant="outlined"
						name="firstName"
						value={contactInfo.firstName}
						onChange={handleInputChange}
						placeholder="John"
					/>

					<TextField
						fullWidth
						margin="normal"
						label="Last Name"
						variant="outlined"
						name="lastName"
						value={contactInfo.lastName}
						onChange={handleInputChange}
						placeholder="John"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Email Address"
						variant="outlined"
						name="email"
						value={contactInfo.email}
						onChange={handleInputChange}
						placeholder="example@email.com"
						error={!!errors.email}
						helperText={errors.email}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Phone Number"
						variant="outlined"
						name="phone"
						value={contactInfo.phone}
						onChange={handleInputChange}
						placeholder="123-456-7890"
						error={!!errors.phone}
						helperText={errors.phone}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Passsword"
						variant="outlined"
						name="password"
						value={contactInfo.password}
						onChange={handleInputChange}
						placeholder="password"
						error={!!errors.password}
						helperText={errors.password}
					/>

					<Box textAlign="center" mt={2}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							onClick={() => {
								handleAddContact(contactInfo, errors);
							}}
						>
							Proceed to Address Information
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
