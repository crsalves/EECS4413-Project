import { Box, Typography, Button, Card, CardContent, Divider, CircularProgress, Alert } from '@mui/material';
import { useContext } from 'react';
import AuthenticationContext from 'src/store/AuthenticationContext';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
	userId: number;
	name: string;
	email: string;
	phone?: string;
	role?: 'customer' | 'admin';
}

export default function RegistrationReviewPage({ userContact, userAddress, userPayment }) {
	const [contactInfo] = useState(userContact);

	const [addressInfo] = useState(userAddress);

	const [cardInfo] = useState(userPayment);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const userContext = useContext(AuthenticationContext);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		setLoading(true);
		setError(null);
		try {
			console.log(
				'Creating account:',
				JSON.stringify({
					contactInfo,
					addressInfo,
					cardInfo
				})
			);

			const newUserContactInfo = {
				name: contactInfo.firstName + ' ' + contactInfo.lastName,
				email: contactInfo.email,
				phone: contactInfo.phone,
				password: contactInfo.password
			};

			const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					contactData: newUserContactInfo,
					addressData: addressInfo,
					paymentData: cardInfo
				})
			});

			if (!response.ok) {
				const data = await response.json();
				console.log('Account not  created:', data);

				throw new Error(data.message);
			}

			const responseJson = await response.json();
			console.log('Account successfully created:', responseJson);
			userContext.onLogin(
				responseJson.data.token,
				responseJson.data.user,
				responseJson.data.userAddress,
				responseJson.data.userPayment
			);

			const previousPath = localStorage.getItem('previousPath') || '/';
			localStorage.removeItem('previousPath'); // Optionally remove it after use

			// Navigate to the previous path or default to '/'
			navigate(previousPath);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom textAlign="center">
				Review Your Information
			</Typography>

			{/* Contact Information */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Contact Information
					</Typography>
					<Typography>Name: {`${contactInfo.firstName} ${contactInfo.lastName}`}</Typography>
					<Typography>Email: {contactInfo.email}</Typography>
					<Typography>Phone: {contactInfo.phone}</Typography>
				</CardContent>
			</Card>

			{/* Address Information */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Address Information
					</Typography>
					<Typography>Street: {addressInfo.street}</Typography>
					<Typography>City: {`${addressInfo.city}, ${addressInfo.province}`}</Typography>
					<Typography>Zip Code: {addressInfo.postalCode}</Typography>
					<Typography>Country: {addressInfo.country}</Typography>
				</CardContent>
			</Card>

			{/* Payment Information */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Payment Information
					</Typography>
					<Typography>Card Number: {cardInfo.cardNumber}</Typography>
					<Typography>Cvv: {cardInfo.cvv}</Typography>
					<Typography>Expiry Date: {cardInfo.expiryDate}</Typography>
				</CardContent>
			</Card>

			{/* Error Alert */}
			{error && (
				<Alert severity="error" sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{/* Submit Button */}
			<Divider />
			<Box textAlign="center" mt={3}>
				{loading ? (
					<CircularProgress />
				) : (
					<Button variant="contained" color="success" size="large" onClick={handleSubmit}>
						Create Account
					</Button>
				)}
			</Box>
		</Box>
	);
}
