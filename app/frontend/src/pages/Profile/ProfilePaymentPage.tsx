import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import {
	Box,
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
	Checkbox,
	FormControlLabel
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useContext } from 'react';
import AuthenticationContext from 'src/store/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePaymentPage() {
	const userContext = useContext(AuthenticationContext);

	const loaderData = useLoaderData() as {
		message: string;
		data: any;
	};
	const userData = loaderData.data;
	const navigate = useNavigate();

	console.log('This is the initia; data', userData);

	const [users, setUsers] = useState<
		{
			userPaymentId: any;
			cardNumber: any;
			expiryDate: any;
			cvv: any;
			paymentTypeId: any;
			isDefault: any;
		}[]
	>([
		{
			userPaymentId: '',
			cardNumber: '',
			expiryDate: '',
			cvv: '',
			paymentTypeId: '',
			isDefault: ''
		}
	]);

	useEffect(() => {
		if (userData) {
			setUsers(userData);
		}
	}, [userData, setUsers]);

	const [error, setError] = useState<String | null>();
	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		userPaymentId: any;
		cardNumber: any;
		expiryDate: any;
		cvv: any;
		paymentTypeId: any;
		isDefault: any;
	}>({
		userPaymentId: '',
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		paymentTypeId: '1',
		isDefault: false
	});
	const [editMode, setEditMode] = useState(false);

	// Open Modal
	const handleOpen = (
		user: {
			userPaymentId: any;
			cardNumber: any;
			expiryDate: any;
			cvv: any;
			paymentTypeId: any;
			isDefault: any;
		} | null = null
	) => {
		if (user) {
			setFormData(user);
			setEditMode(true);
		} else {
			setFormData({
				userPaymentId: '',
				cardNumber: '',
				expiryDate: '',
				cvv: '',
				paymentTypeId: '1',
				isDefault: false
			});
			setEditMode(false);
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Add or Update User
	const handleSubmit = async () => {
		const token = localStorage.getItem('token');
		console.log('Updating address ', token);

		if (editMode) {
			try {
				const updateData = {
					userPaymentId: formData.userPaymentId,
					cardNumber: formData.cardNumber,
					expiryDate: formData.expiryDate,
					cvv: formData.cvv,
					paymentTypeId: formData.paymentTypeId,
					isDefault: formData.isDefault === false ? 0 : 1
				};
				console.log('Updating address with token ', JSON.stringify(updateData));

				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/user/${userContext.user.userId}/payment/${formData.userPaymentId}`,
					{
						method: 'PUT',
						body: JSON.stringify(updateData),
						headers: {
							'Content-Type': 'application/json',
							Authorization: token!
						}
					}
				);

				if (response.ok) {
					console.log('The response was okay', response.json());
					setUsers(
						users.map((user) => (user.userPaymentId === formData.userPaymentId ? { ...formData } : user))
					);
				} else {
					console.log('The response was not  okay', response.json());
					throw new Error('Failed to submit the order');
				}
			} catch (err: Error | any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		} else {
			const updateData = {
				userId: userContext.user.userId,
				cardNumber: formData.cardNumber,
				expiryDate: formData.expiryDate,
				cvv: formData.cvv,
				paymentTypeId: formData.paymentTypeId,
				isDefault: formData.isDefault === false ? 0 : 1
			};
			console.log('Updating address with token ', JSON.stringify(updateData));

			const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userContext.user.userId}/address`, {
				method: 'POST',
				body: JSON.stringify(updateData),
				headers: {
					'Content-Type': 'application/json',
					Authorization: token!
				}
			});

			if (response.ok) {
				const responseData = await response.json();
				const newUserAddressId = responseData?.data.userPaymentId;
				console.log('The response was okay', responseData);
				setUsers([...users, { ...formData, userPaymentId: newUserAddressId }]);
			} else {
				console.log('The response was not  okay', response.json());
				throw new Error('Failed to submit the order');
			}
		}
		handleClose();
	};

	// Delete User
	const handleDelete = (userPaymentId) => {
		setUsers(users.filter((user) => user.userPaymentId !== userPaymentId));
	};

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant="h4" gutterBottom>
				Billing Information
			</Typography>
			<Button variant="contained" color="primary" onClick={() => handleOpen()}>
				Add Card
			</Button>

			{/* Product Table */}
			<TableContainer component={Paper} style={{ marginTop: '20px' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Card Number</TableCell>
							<TableCell>Expire Date</TableCell>
							<TableCell>Provicnce</TableCell>
							<TableCell>Cvv</TableCell>
							<TableCell>Is Default</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.userPaymentId}>
								<TableCell>{user.cardNumber}</TableCell>
								<TableCell>{user.expiryDate}</TableCell>
								<TableCell>{user.cvv}</TableCell>

								<TableCell>{user.isDefault}</TableCell>

								<TableCell>
									<IconButton color="primary" onClick={() => handleOpen(user)}>
										<Edit />
									</IconButton>
									<IconButton color="secondary" onClick={() => handleDelete(user.userPaymentId)}>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box>
				<br />
				<br />
			</Box>

			<Box>
				<Button
					onClick={() => {
						navigate('/user/' + userContext.user.userId);
					}}
					variant="contained"
				>
					Back to Account
				</Button>
			</Box>

			{/* Add/Edit Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editMode ? 'Edit Card' : 'Add Card'}</DialogTitle>
				<DialogContent>
					<TextField
						label="cardNumber"
						name="cardNumber"
						value={formData.cardNumber}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="expiryDate"
						name="expiryDate"
						value={formData.expiryDate}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="cvv"
						name="cvv"
						value={formData.cvv}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={true ? formData.isDefault === '1' : false}
								onChange={handleChange}
								name="isDefault"
								value={true ? formData.isDefault === '1' : false}
							/>
						}
						label="Is Default"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						{editMode ? (loading ? 'Updating...' : 'Update') : 'Add'}
					</Button>

					{error && <p style={{ color: 'red' }}>{error}</p>}
				</DialogActions>
			</Dialog>
		</div>
	);
}
