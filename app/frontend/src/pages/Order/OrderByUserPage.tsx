import { useLoaderData } from 'react-router-dom';
import styles from './OrderPage.module.css';

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

	const orders = loaderData.orders.data;

	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>Your Orders</h1>
			{orders.length === 0 ? (
				<p className={styles.noOrders}>No orders found for this user.</p>
			) : (
				<div className={styles.orderList}>
					{orders.map((order) => (
						<div className={styles.orderCard} key={order.orderId}>
							<h2>Order Confirmation</h2>
							<p>
								<strong>Order ID:</strong> {order.orderId}
							</p>
							<p>
								<strong>User ID:</strong> {order.userId}
							</p>
							<p>
								<strong>Total Price:</strong> ${order.totalPrice}
							</p>
							<p>
								<strong>Status:</strong> {order.status}
							</p>
							<p>
								<strong>Payment Status:</strong> {order.paymentStatus}
							</p>
							<p>
								<strong>User Payment ID:</strong> {order.userPaymentId}
							</p>
							<p>
								<strong>Shipping Address ID:</strong> {order.shippingAddressId}
							</p>
							<p>
								<strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
							</p>
							<p>
								<strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
