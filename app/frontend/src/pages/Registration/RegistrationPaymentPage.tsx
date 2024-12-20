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

// export default function RegistrationPage({ handleAddPayment }) {
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

export default function RegistrationPaymentPage({ paymentData, handleAddPayment }) {
	const [cardInfo, setCardInfo] = useState(paymentData);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCardInfo({ ...cardInfo, [name]: value });
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Register Your Account
			</Typography>
			<Typography variant="h6" gutterBottom>
				Enter Your Credit Card Information
			</Typography>
			<Card variant="outlined">
				<CardContent>
					<TextField
						fullWidth
						margin="normal"
						label="Card Number"
						variant="outlined"
						name="cardNumber"
						value={cardInfo.cardNumber}
						onChange={handleInputChange}
						placeholder="1234 5678 9012 3456"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Cardholder Name"
						variant="outlined"
						name="cardName"
						value={cardInfo.cardName}
						onChange={handleInputChange}
						placeholder="John Doe"
					/>
					<Box display="flex" gap={2}>
						<TextField
							fullWidth
							margin="normal"
							label="Expiry Date"
							variant="outlined"
							name="expiryDate"
							value={cardInfo.expiryDate}
							onChange={handleInputChange}
							placeholder="MM/YY"
						/>
						<TextField
							fullWidth
							margin="normal"
							label="CVV"
							variant="outlined"
							name="cvv"
							value={cardInfo.cvv}
							onChange={handleInputChange}
							placeholder="123"
						/>
					</Box>
					<Box textAlign="center" mt={2}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							onClick={() => {
								handleAddPayment(cardInfo);
							}}
						>
							Review Your Information
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
