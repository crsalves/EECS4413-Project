import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	IconButton,
	Typography,
	Select,
	MenuItem
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import styles from './AdminOrdersPage.module.css';

const OrderCRUDPage = () => {
	const [orders, setOrders] = useState([
		{
			orderId: 1,
			userId: 1,
			totalPrice: 55,
			status: 'Pending',
			paymentStatus: 'Approved',
			paymentTypeId: 1,
			shippingAddress: '123 Main Street'
		},
		{
			orderId: 2,
			userId: 2,
			totalPrice: 120,
			status: 'Shipped',
			paymentStatus: 'Pending',
			paymentTypeId: 2,
			shippingAddress: '456 Park Avenue'
		}
	]);

	const [open, setOpen] = useState(false); // Open/Close Modal
	const [formData, setFormData] = useState({
		orderId: -1,
		userId: -1,
		totalPrice: -1,
		status: 'Pending',
		paymentStatus: 'Pending',
		paymentTypeId: -1,
		shippingAddress: ''
	});
	const [editMode, setEditMode] = useState(false);

	// Open modal to add/edit an order
	const handleOpen = (
		order: {
			orderId: number;
			userId: number;
			totalPrice: number;
			status: string;
			paymentStatus: string;
			paymentTypeId: number;
			shippingAddress: string;
		} | null = null
	) => {
		if (order) {
			setFormData(order);
			setEditMode(true);
		} else {
			setFormData({
				orderId: -1,
				userId: -1,
				totalPrice: -1,
				status: '',
				paymentStatus: '',
				paymentTypeId: -1,
				shippingAddress: ''
			});
			setEditMode(false);
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle add/edit submission
	const handleSubmit = () => {
		if (editMode) {
			setOrders(orders.map((order) => (order.orderId === formData.orderId ? { ...order, ...formData } : order)));
		} else {
			setOrders([
				...orders,
				{ ...formData, orderId: orders.length + 1, totalPrice: parseFloat(formData.totalPrice.toString()) }
			]);
		}
		setOpen(false);
	};

	// Handle delete
	const handleDelete = (orderId) => {
		setOrders(orders.filter((order) => order.orderId !== orderId));
	};

	return (
		<div className={styles.adminContainer}>
			<Typography variant="h4" gutterBottom>
				Order Management
			</Typography>
			<Button variant="contained" className={styles.primaryButton} onClick={() => handleOpen()}>
				Add Order
			</Button>

			{/* Table */}
			<TableContainer component={Paper} className={styles.tableContainer}>
				<Table>
					<TableHead>
						<TableRow className={styles.tableRow}>
							<TableCell>Order ID</TableCell>
							<TableCell>User ID</TableCell>
							<TableCell>Total Price ($)</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Payment Status</TableCell>
							<TableCell>Payment Type ID</TableCell>
							<TableCell>Shipping Address</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.orderId}>
								<TableCell>{order.orderId}</TableCell>
								<TableCell>{order.userId}</TableCell>
								<TableCell>{order.totalPrice}</TableCell>
								<TableCell>{order.status}</TableCell>
								<TableCell>{order.paymentStatus}</TableCell>
								<TableCell>{order.paymentTypeId}</TableCell>
								<TableCell>{order.shippingAddress}</TableCell>
								<TableCell>
									<IconButton color="primary" onClick={() => handleOpen(order)}>
										<Edit />
									</IconButton>
									<IconButton color="secondary" onClick={() => handleDelete(order.orderId)}>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Modal for Add/Edit */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editMode ? 'Edit Order' : 'Add Order'}</DialogTitle>
				<DialogContent>
					<TextField
						label="User ID"
						name="userId"
						value={formData.userId}
						onChange={handleChange}
						fullWidth
						margin="dense"
						type="number"
					/>
					<TextField
						label="Total Price"
						name="totalPrice"
						value={formData.totalPrice}
						onChange={handleChange}
						fullWidth
						margin="dense"
						type="number"
					/>
					<TextField
						label="Shipping Address"
						name="shippingAddress"
						value={formData.shippingAddress}
						onChange={handleChange}
						fullWidth
						margin="dense"
					/>
					<TextField
						label="Payment Type ID"
						name="paymentTypeId"
						value={formData.paymentTypeId}
						onChange={handleChange}
						fullWidth
						margin="dense"
						type="number"
					/>
					<Select
						label="Status"
						name="status"
						value={formData.status}
						onChange={handleChange}
						fullWidth
						margin="dense"
						displayEmpty
					>
						<MenuItem value="Pending">Pending</MenuItem>
						<MenuItem value="Shipped">Shipped</MenuItem>
						<MenuItem value="Delivered">Delivered</MenuItem>
					</Select>
					<Select
						label="Payment Status"
						name="paymentStatus"
						value={formData.paymentStatus}
						onChange={handleChange}
						fullWidth
						margin="dense"
						displayEmpty
					>
						<MenuItem value="Pending">Pending</MenuItem>
						<MenuItem value="Approved">Approved</MenuItem>
						<MenuItem value="Rejected">Rejected</MenuItem>
					</Select>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						{editMode ? 'Update' : 'Add'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default OrderCRUDPage;
