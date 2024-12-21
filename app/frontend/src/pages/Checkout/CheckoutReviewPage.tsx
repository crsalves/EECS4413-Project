import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Divider,
	List,
	ListItem,
	ListItemText,
	Alert,
	CircularProgress
} from '@mui/material';

import { useContext, useState } from 'react';
import AuthenticationContext from 'src/store/AuthenticationContext';
import CartContext from 'src/store/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CheckoutReviewPage({ orderAddressId, orderCardId }) {
	const cartContext = useContext(CartContext);
	const userContext = useContext(AuthenticationContext);

	const totalAmount = cartContext.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);
	const navigate = useNavigate();

	const userPayment = userContext.userPayment;
	const userAddress = userContext.userAddress;

	const orderAddress = userAddress
		? userAddress.find((address) => address.userAddressId === parseInt(orderAddressId))
		: null;
	const cardData = userPayment ? userPayment.find((card) => card.userPaymentId === orderCardId) : null;

	const [items] = useState(cartContext.items);

	const [contactInfo] = useState(userContext.user);

	const [addressInfo] = useState(orderAddress);

	const [cardInfo] = useState(cardData);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	console.log('Order Address:', JSON.stringify(orderAddress));
	console.log('User Address:', JSON.stringify(userAddress));
	console.log('orderAddressId:', JSON.stringify(orderAddressId));

	const handleConfirmOrder = async () => {
		setLoading(true);
		setError(null);
		try {
			const orderData = {
				userId: userContext.user.userId,
				totalPrice: totalAmount,
				userPaymentId: orderCardId,
				shippingAddressId: orderAddressId,
				billingAddressId: orderAddressId,
				products: cartContext.items.map((item) => ({
					productId: item.id,
					quantity: item.quantity
				}))
			};

			const token = localStorage.getItem('token');

			const orderPostResponse = await fetch(`${process.env.REACT_APP_API_URL}/order`, {
				method: 'POST',
				body: JSON.stringify(orderData),
				headers: {
					'Content-Type': 'application/json',
					Authorization: token!
				}
			});

			if (orderPostResponse.ok) {
				const responseData = await orderPostResponse.json();

				console.log('Order Submitted:', responseData);
				const orderId = responseData.data.orderId;

				const orderGetResponse = await fetch(`${process.env.REACT_APP_API_URL}/order/` + orderId, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: token!
					}
				});

				if (orderGetResponse.ok) {
					const orderJson = await orderGetResponse.json();
					cartContext.submitOrder();

					navigate('/order/view/' + orderJson.data.orderId);
				}

				throw new Error('Failed to submit the order');
			} else {
				throw new Error('Failed to submit the order');
			}
		} catch (err: Error | any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom textAlign="center">
				Checkout Summary
			</Typography>

			{/* Order Items */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Items in Your Order
					</Typography>
					<List>
						{items.map((item) => (
							<ListItem key={item.id}>
								<ListItemText
									primary={`${item.name} (x${item.quantity})`}
									secondary={`$${item.price.toFixed(2)} each`}
								/>
							</ListItem>
						))}
					</List>
					<Divider />
					<Typography variant="h6" mt={2}>
						Total: ${totalAmount.toFixed(2)}
					</Typography>
				</CardContent>
			</Card>

			{/* Contact Information */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Contact Information
					</Typography>
					<Typography>Name: {`${contactInfo.name} `}</Typography>
					<Typography>Email: {contactInfo.email}</Typography>
					<Typography>Phone: {contactInfo.phone}</Typography>
				</CardContent>
			</Card>

			{/* Address Information */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Shipping Address
					</Typography>
					<Typography>Street: {addressInfo?.street}</Typography>
					<Typography>City: {`${addressInfo?.city}, ${addressInfo?.province}`}</Typography>
					<Typography>Zip Code: {addressInfo?.postalCode}</Typography>
					<Typography>Country: {addressInfo?.country}</Typography>
				</CardContent>
			</Card>

			{/* Payment Information */}
			<Card variant="outlined" sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Payment Information
					</Typography>
					<Typography>Card Number: {cardInfo?.cardNumber}</Typography>
					<Typography>Expiry Date: {cardInfo?.expiryDate}</Typography>
				</CardContent>
			</Card>

			{/* Error Alert */}
			{error && (
				<Alert severity="error" sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{/* Confirm Order Button */}
			<Divider />
			<Box textAlign="center" mt={3}>
				{loading ? (
					<CircularProgress />
				) : (
					<Button variant="contained" color="primary" size="large" onClick={handleConfirmOrder}>
						Confirm Order
					</Button>
				)}
			</Box>
		</Box>
	);
}
