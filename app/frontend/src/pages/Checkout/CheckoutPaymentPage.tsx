import {
	Box,
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	Card,
	CardContent,
	TextField,
	Button
} from '@mui/material';

import { useState } from 'react';
import { useContext } from 'react';
import AuthenticationContext from 'src/store/AuthenticationContext';

export default function CheckoutAdressPaymentPage({ handleSelectCard }) {
	const userContext = useContext(AuthenticationContext);

	const userPayment = userContext.userPayment;

	const defaultPayment = userPayment ? userPayment.find((card) => card.isDefault) : null;

	console.log('Default Payment:', defaultPayment);

	const [selectedCard, setSelectedCard] = useState(defaultPayment?.userPaymentId ?? '');
	const [newCard, setNewCard] = useState({
		number: '',
		name: '',
		expiry: '',
		cvv: ''
	});
	const userCards = userPayment
		? userPayment.map((card) => ({
				id: card.userPaymentId,
				number: card.cardNumber,
				name: userContext.user.name,
				expire: card.expiryDate,
				cvv: card.cvv
			}))
		: [];

	const [cards, setCards] = useState(userCards);

	const [error, setError] = useState<String | null>();

	const handleCardSelect = (event) => {
		setSelectedCard(event.target.value);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewCard({ ...newCard, [name]: value });
	};

	const handleAddCard = async () => {
		if (newCard.number && newCard.name && newCard.expiry && newCard.cvv) {
			const newCardData = {
				id: cards.length + 1,
				number: `**** **** **** ${newCard.number.slice(-4)}`,
				name: newCard.name,
				expire: newCard.expiry,
				cvv: newCard.cvv
			};

			const userCard = {
				userId: userContext.user.userId,
				cardNumber: newCard.number,
				expiryDate: newCard.expiry,
				cvv: newCard.cvv,
				paymentTypeId: 1,
				isDefault: 0
			};

			try {
				console.log('Adding card ', JSON.stringify(userCard));
				const token = localStorage.getItem('token');

				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/user/${userContext.user.userId}/payment`,
					{
						method: 'POST',
						body: JSON.stringify(userCard),
						headers: {
							'Content-Type': 'application/json',
							Authorization: token!
						}
					}
				);

				if (response.ok) {
					console.log('Added new card', response.json());
					setCards([...cards, newCardData]);
					setSelectedCard(newCardData.id.toString());
					setNewCard({ number: '', name: '', expiry: '', cvv: '' });
				} else {
					console.log('The response was not  okay', response.json());
					throw new Error('Failed to submit the order');
				}
			} catch (err: Error | any) {
				setError(err.message);
			}
		}
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Payment Checkout
			</Typography>
			<Typography variant="h6">Select a Credit Card</Typography>
			<Card variant="outlined">
				<CardContent>
					<RadioGroup value={selectedCard} onChange={handleCardSelect}>
						{cards.map((card) => (
							<FormControlLabel
								key={card.id}
								value={card.id}
								control={<Radio />}
								label={`${card.number} (${card.name})`}
							/>
						))}
					</RadioGroup>
				</CardContent>
			</Card>

			<Typography variant="h6" mt={3} gutterBottom>
				Or Add a New Credit Card
			</Typography>
			<Card variant="outlined">
				<CardContent>
					<TextField
						fullWidth
						margin="normal"
						label="Card Number"
						variant="outlined"
						name="number"
						value={newCard.number}
						onChange={handleInputChange}
						placeholder="1234 5678 9012 3456"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Cardholder Name"
						variant="outlined"
						name="name"
						value={newCard.name}
						onChange={handleInputChange}
						placeholder="John Doe"
					/>
					<Box display="flex" gap={2}>
						<TextField
							fullWidth
							margin="normal"
							label="Expiry Date"
							variant="outlined"
							name="expiry"
							value={newCard.expiry}
							onChange={handleInputChange}
							placeholder="MM/YY"
						/>
						<TextField
							fullWidth
							margin="normal"
							label="CVV"
							variant="outlined"
							name="cvv"
							value={newCard.cvv}
							onChange={handleInputChange}
							placeholder="123"
						/>
					</Box>
					<Button variant="contained" color="primary" onClick={handleAddCard} sx={{ mt: 2 }}>
						Add Card
					</Button>
				</CardContent>
			</Card>

			<Box textAlign="right" mt={4}>
				<Button
					variant="contained"
					color="success"
					size="large"
					disabled={!selectedCard}
					onClick={() => handleSelectCard(selectedCard)}
					style={{ marginBottom: '16px' }}
					sx={{ mr: 10 }}
				>
					Proceed to Payment
				</Button>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</Box>
		</Box>
	);
}
