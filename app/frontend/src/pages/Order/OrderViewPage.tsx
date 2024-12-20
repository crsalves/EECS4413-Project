import { useLoaderData } from 'react-router-dom';

// import styles from './OrderPage.module.css';

// export default function OrderViewPage() {
// 	// Fetch the product data from the loader
// 	const loaderData = useLoaderData() as {
// 		message: string;
// 		order: {
// 			data: {
// 				orderId: number;
// 				userId: number;
// 				totalPrice: number;
// 				userPaymentId: number;
// 				shippingAddressId: number;
// 				createdAt: Date;
// 				updatedAt: Date;
// 			};
// 		};
// 	};

// 	const order = loaderData.order.data;

// 	return (
// 		<>
// 			<div>
// 				<div className={styles.container}>
// 					<h2>Order Confirmation</h2>
// 					<p>Order ID: {order.orderId}</p>
// 					<p>User ID: {order.userId}</p>
// 					<p>Total Price: ${order.totalPrice}</p>
// 					<p>User Payment ID: {order.userPaymentId}</p>
// 					<p>Shipping Address ID: {order.shippingAddressId}</p>
// 					<p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
// 					<p>Updated At: {new Date(order.updatedAt).toLocaleString()}</p>
// 				</div>
// 			</div>
// 		</>
// 	);
// }


import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';

export default function OrderViewPage() {
	const loaderData = useLoaderData() as {
		message: string;
		order: {
			data: {
				orderId: number;
				userId: number;
				totalPrice: number;
				userPaymentId: number;
				shippingAddressId: number;
				createdAt: Date;
				updatedAt: Date;
			};
		};
	};

	const orderDetails = loaderData.order.data;

	return (
		<Box maxWidth="600px" margin="auto" mt={4} textAlign="center">
			<Card variant="outlined">
				<CardContent>
					<Typography variant="h4" gutterBottom color="success.main">
						Thank You!
					</Typography>
					<Typography variant="h6" gutterBottom>
						Your order has been successfully placed.
					</Typography>
					<Typography variant="body1" mt={2}>
						<strong>Order Number:</strong> {orderDetails?.orderId}
					</Typography>
					<Typography variant="body1" mt={1}>
						<strong>Total Price:</strong> ${orderDetails?.totalPrice}
					</Typography>
					<Typography variant="body1" mt={1}>
						<strong>Expected Shipping Date:</strong> 3 days from now
					</Typography>
					<Divider sx={{ my: 2 }} />
					<Typography>A confirmation email has been sent to your registered email address.</Typography>
				</CardContent>
			</Card>
		</Box>
	);
};


