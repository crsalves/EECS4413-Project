import { useLoaderData } from 'react-router-dom';
import { useContext } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import AuthenticationContext from 'src/store/AuthenticationContext';
import styles from './OrderByUserPage.module.css';

export default function OrderByUserPage() {
	const loaderData = useLoaderData() as {
		message: string;
		orders: {
			data: {
				orderId: number;
				userId: number;
				totalPrice: number;
				status: string;
				paymentStatus: string;
				userPaymentId: number;
				shippingAddressId: number;
				createdAt: string;
				updatedAt: string;
			}[];
		};
	};

	const userContext = useContext(AuthenticationContext);

	const userPayment = userContext.userPayment;
	const userAddress = userContext.userAddress;

	const orders = loaderData.orders.data;

	// add address and card data to orders

	const ordersWithAddressAndCard = orders.map((order) => {
		const orderAddress = userAddress
			? userAddress.find((address) => address.userAddressId === order.shippingAddressId)
			: null;
		const cardData = userPayment ? userPayment.find((card) => card.userPaymentId === order.userPaymentId) : null;

		return { ...order, orderAddress, cardData };
	});

	console.log('Orders with address and card:', ordersWithAddressAndCard);

	return (
		<div className={styles.pageContainer}>
			<Box p={3}>
				<div className={styles.title}>
					<Typography variant="h4" gutterBottom>
						Your Orders
					</Typography>
				</div>

				{orders.length === 0 ? (
					<div className={styles.noOrders}>
						<Typography variant="body1">No orders found for this user.</Typography>
					</div>
				) : (
					<Grid container spacing={3} className={styles.orderList}>
						{ordersWithAddressAndCard.map((order) => (
							<Grid item xs={12} md={6} lg={4} key={order.orderId}>
								<Card className={styles.orderCards}>
									<CardContent className={styles.orderCardContent}>
										<Typography variant="h6" gutterBottom>
											Order Confirmation
										</Typography>
										<Typography variant="body1">
											<strong>Order ID:</strong> {order.orderId}
										</Typography>
										<Typography variant="body1">
											<strong>Total Price:</strong> ${order.totalPrice}
										</Typography>
										<Typography variant="body1">
											<strong>Status:</strong> Approved
										</Typography>
										{order.orderAddress && (
											<>
												<Typography variant="h6" gutterBottom>
													Shipping Address
												</Typography>
												<Typography variant="body1">
													<strong>Street:</strong> {order.orderAddress.street}
												</Typography>
												<Typography variant="body1">
													<strong>City:</strong> {order.orderAddress.city}
												</Typography>
												<Typography variant="body1">
													<strong>Province:</strong> {order.orderAddress.province}
												</Typography>
												<Typography variant="body1">
													<strong>Postal Code:</strong> {order.orderAddress.postalCode}
												</Typography>
												<Typography variant="body1">
													<strong>Country:</strong> {order.orderAddress.country}
												</Typography>
											</>
										)}
										{order.cardData && (
											<>
												<Typography variant="h6" gutterBottom>
													Card Information
												</Typography>
												<Typography variant="body1">
													<strong>Card Number:</strong> **** **** ****{' '}
													{order.cardData.cardNumber.slice(-4)}
												</Typography>
												<Typography variant="body1">
													<strong>Cardholder Name:</strong> {userContext.user?.name}
												</Typography>
												<Typography variant="body1">
													<strong>Expiry Date:</strong> {order.cardData.expiryDate}
												</Typography>
											</>
										)}
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}
			</Box>
		</div>
	);
}
