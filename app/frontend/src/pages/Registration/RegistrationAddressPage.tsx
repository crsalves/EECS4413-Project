// import { useContext, useEffect, useState } from 'react';
// import { Form, useActionData, useNavigate } from 'react-router-dom';
// import AuthenticationContext from '../../store/AuthenticationContext';
// import styles from './RegistrationPage.module.css';

// export interface User {
// 	userId: number;
// 	name: string;
// 	email: string;
// 	passwordHash: string;
// 	phone?: string;
// 	addressStreet?: string;
// 	addressComplement?: string;
// 	addressProvince?: string;
// 	addressCountry?: string;
// 	addressPostalCode?: string;
// 	role?: 'customer' | 'admin';
// 	createdAt?: Date;
// 	updatedAt?: Date;
// }

// interface RegisterActionData {
// 	message: string;
// 	status?: number;
// 	data?: { user: User; token: string };
// }

// export default function RegistrationAddressPage({ handleAddAddress }) {
// 	let errorMessage;
// 	const [error, setError] = useState<String>();
// 	const userContext = useContext(AuthenticationContext);
// 	const navigate = useNavigate();

// 	const registerActionData = useActionData() as RegisterActionData;

// 	useEffect(() => {
// 		if (registerActionData && registerActionData?.data?.token && registerActionData.data.user) {
// 			console.log('origin', location);
// 			const token = registerActionData.data.token;

// 			const user = registerActionData.data.user;

// 			console.log('registerActionData', registerActionData);

// 			if (token !== null && token!) {
// 				userContext.onLogin(token, user, null, null);
// 				// Retrieve the previous path from local storage
// 				const previousPath = localStorage.getItem('previousPath') || '/';
// 				localStorage.removeItem('previousPath'); // Optionally remove it after use

// 				// Navigate to the previous path or default to '/'
// 				navigate(previousPath);
// 			} else {
// 				userContext.onLogout();
// 			}
// 		} else if (registerActionData && registerActionData.status === 500) {
// 			console.log('.errors', registerActionData.message);
// 			setError(`Error: ${registerActionData.message}`);
// 		}
// 	}, [registerActionData, userContext, navigate]);

// 	if (error) {
// 		errorMessage = <p>{error}</p>;
// 	}

// 	return (
// 		<div className={styles.container}>
// 			{!userContext.isLoggedInContext && (
// 				<div className={styles.form}>
// 					<Form method="POST">
// 						<h2>Register as a member</h2>

// 						<div className={styles.message}>
// 							<section>{errorMessage}</section>
// 						</div>
// 						<p className={styles.title}>Register as a member</p>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="name">Name</label>
// 							<input id="name" name="name" required autoFocus />
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="email">Email</label>
// 							<input
// 								id="email"
// 								type="email"
// 								name="email"
// 								pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+$" // TODO: add regex for preventing spaces
// 								required
// 								autoFocus
// 								placeholder="Enter your email"
// 							/>
// 						</div>
// 						<div className={styles.inputGroup}>
// 							<label htmlFor="password">Password</label>
// 							<input
// 								id="password"
// 								type="password"
// 								name="password"
// 								pattern="[^\s]+"
// 								required
// 								autoComplete="current-password"
// 								placeholder="Enter your password"
// 							/>
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="phone">Phone</label>
// 							<input id="phone" name="phone" required autoFocus />
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="street">Street</label>
// 							<input id="street" name="street" required autoFocus />
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="complement">Complement</label>
// 							<input id="complement" name="complement" required autoFocus />
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="province">Province</label>
// 							<input id="province" name="province" required autoFocus />
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="country">Country</label>
// 							<input id="country" name="country" required autoFocus />
// 						</div>

// 						<div className={styles.inputGroup}>
// 							<label htmlFor="postalCode">PostalCode</label>
// 							<input id="postalCode" name="postalCode" required autoFocus />
// 						</div>

// 						<div className={styles.submit}>
// 							<button className={styles.btn}>Submit</button>
// 						</div>
// 					</Form>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { useState } from 'react';

export default function RegisterAddressPage({ addressData, handleAddAddress }) {
	const [addressInfo, setAddressInfo] = useState(addressData);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAddressInfo({ ...addressInfo, [name]: value });
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Register Your Account
			</Typography>
			<Typography variant="h6" gutterBottom>
				Enter Your Address Information
			</Typography>
			<Card variant="outlined">
				<CardContent>
					<TextField
						fullWidth
						margin="normal"
						label="Street Address"
						variant="outlined"
						name="street"
						value={addressInfo.street}
						onChange={handleInputChange}
						placeholder="123 Main St"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Complement"
						variant="outlined"
						name="complement"
						value={addressInfo.complement}
						onChange={handleInputChange}
						placeholder="123 Main St"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="City"
						variant="outlined"
						name="city"
						value={addressInfo.city}
						onChange={handleInputChange}
						placeholder="Los Angeles"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Province"
						variant="outlined"
						name="province"
						value={addressInfo.province}
						onChange={handleInputChange}
						placeholder="ON"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Postal Code"
						variant="outlined"
						name="postalCode"
						value={addressInfo.postalCode}
						onChange={handleInputChange}
						placeholder="90001"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Country"
						variant="outlined"
						name="country"
						value={addressInfo.country}
						onChange={handleInputChange}
						placeholder="USA"
					/>
					<Box textAlign="center" mt={2}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							onClick={() => {
								handleAddAddress(addressInfo);
							}}
						>
							Proceed To Payment Information
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
