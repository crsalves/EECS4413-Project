import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

import { useState } from 'react';

export default function RegistrationPaymentPage({ paymentData, handleAddPayment }) {
	const [cardInfo, setCardInfo] = useState(paymentData);
	const [errors, setErrors] = useState({ cardNumber: '', expiryDate: '', cvv: '' });

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCardInfo({ ...cardInfo, [name]: value });

		// Format card number with spaces after every 4 digits
		let formattedValue = value;
		if (name === 'cardNumber') {
			formattedValue = value
				.replace(/\s?/g, '')
				.replace(/(\d{4})/g, '$1 ')
				.trim();
		}
		setCardInfo({ ...cardInfo, [name]: formattedValue });

		// Validation logic for card number
		if (name === 'cardNumber') {
			const cardNumberRegex = /^\d{4} \d{4} \d{4} \d{4}$/;
			setErrors({
				...errors,
				cardNumber: cardNumberRegex.test(value) ? '' : 'Invalid card number. Must be 16 digits'
			});
		}

		// Validation logic for expiry date
		if (name === 'expiryDate') {
			const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
			setErrors({
				...errors,
				expiryDate: expiryDateRegex.test(value) ? '' : 'Invalid expiry date. Expected format: MM/YY'
			});
		}

		// Validation logic for CVV
		if (name === 'cvv') {
			const cvvRegex = /^\d{3,4}$/;
			setErrors({
				...errors,
				cvv: cvvRegex.test(value) ? '' : 'Invalid CVV. Must be 3 or 4 digits'
			});
		}
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
						error={!!errors.cardNumber}
						helperText={errors.cardNumber}
						inputProps={{ maxLength: 19 }}
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
							error={!!errors.expiryDate}
							helperText={errors.expiryDate}
							inputProps={{ maxLength: 5 }}
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
							error={!!errors.cvv}
							helperText={errors.cvv}
							inputProps={{ maxLength: 3 }}
						/>
					</Box>
					<Box textAlign="center" mt={2}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							onClick={() => {
								handleAddPayment(cardInfo, errors);
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
