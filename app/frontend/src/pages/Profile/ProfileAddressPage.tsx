import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
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
	Checkbox,
	FormControlLabel,
	Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useContext } from 'react';
import AuthenticationContext from 'src/store/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileAddressPage() {
	const userContext = useContext(AuthenticationContext);

	const loaderData = useLoaderData() as {
		message: string;
		data: any;
	};
	const userData = loaderData.data;

	console.log('This is the initia; data', userData);

	const [users, setUsers] = useState<
		{
			userAddressId: any;
			userId: any;
			street: any;
			complement: any;
			city: any;
			province: any;
			country: any;
			postalCode: any;
			isDefault: any;
		}[]
	>([
		{
			userAddressId: '',
			userId: '',
			street: '',
			complement: '',
			city: '',
			province: '',
			country: '',
			postalCode: '',
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
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		userAddressId: any;
		userId: any;
		street: any;
		complement: any;
		city: any;
		province: any;
		country: any;
		postalCode: any;
		isDefault: any;
	}>({
		userAddressId: '',
		userId: '',
		street: '',
		complement: '',
		city: '',
		province: '',
		country: '',
		postalCode: '',
		isDefault: ''
	});
	const [editMode, setEditMode] = useState(false);

	// Open Modal
	const handleOpen = (
		user: {
			userAddressId: any;
			userId: any;
			street: any;
			complement: any;
			city: any;
			province: any;
			country: any;
			postalCode: any;
			isDefault: any;
		} | null = null
	) => {
		if (user) {
			setFormData(user);
			setEditMode(true);
		} else {
			setFormData({
				userAddressId: '',
				userId: '',
				street: '',
				complement: '',
				city: '',
				province: '',
				country: '',
				postalCode: '',
				isDefault: ''
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
					userId: userContext.user.userId,
					street: formData.street,
					complement: formData.street,
					city: formData.city,
					province: formData.province,
					country: formData.country,
					postalCode: formData.postalCode,
					isDefault: formData.isDefault
				};
				console.log('Updating address with token ', JSON.stringify(updateData));

				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/user/${userContext.user.userId}/address/${formData.userAddressId}`,
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
						users.map((user) => (user.userAddressId === formData.userAddressId ? { ...formData } : user))
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
				street: formData.street,
				complement: formData.street,
				city: formData.city,
				province: formData.province,
				country: formData.country,
				postalCode: formData.postalCode,
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
				const newUserAddressId = responseData?.data.userAddressId;
				console.log('The response was okay', responseData);
				setUsers([...users, { ...formData, userAddressId: newUserAddressId }]);
			} else {
				console.log('The response was not  okay', response.json());
				throw new Error('Failed to submit the order');
			}
		}
		handleClose();
	};

	// Delete User
	const handleDelete = (userAddressId) => {
		setUsers(users.filter((user) => user.userAddressId !== userAddressId));
	};

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant="h4" gutterBottom>
				Address Information
			</Typography>
			<Button variant="contained" color="primary" onClick={() => handleOpen()}>
				Add Address
			</Button>

			{/* User Table */}
			<TableContainer component={Paper} style={{ marginTop: '20px' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Street</TableCell>
							<TableCell>Complement</TableCell>
							<TableCell>City</TableCell>
							<TableCell>Provicnce</TableCell>
							<TableCell>Countery</TableCell>
							<TableCell>Postal Cod ID</TableCell>
							<TableCell>Is Default</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.userAddressId}>
								<TableCell>{user.street}</TableCell>
								<TableCell>{user.complement}</TableCell>
								<TableCell>{user.city}</TableCell>
								<TableCell>{user.province}</TableCell>
								<TableCell>{user.country}</TableCell>
								<TableCell>{user.postalCode}</TableCell>
								<TableCell>{user.isDefault === true ? 'Yes' : 'No'}</TableCell>
								<TableCell>
									<IconButton color="primary" onClick={() => handleOpen(user)}>
										<Edit />
									</IconButton>
									<IconButton color="secondary" onClick={() => handleDelete(user.userAddressId)}>
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
				<DialogTitle>{editMode ? 'Edit Address' : 'Add Address'}</DialogTitle>
				<DialogContent>
					<TextField
						label="Street"
						name="street"
						value={formData.street}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Complement"
						name="complement"
						value={formData.complement}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="City"
						name="city"
						value={formData.city}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Province"
						name="province"
						value={formData.province}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Country"
						name="country"
						value={formData.country}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Postal Code"
						name="postalCode"
						value={formData.postalCode}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={true ? formData.isDefault === true : false}
								onChange={() => {
									setFormData({ ...formData, isDefault: !formData.isDefault });
								}}
								name="isDefault"
								value={true ? formData.isDefault === true : false}
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
						{editMode ? (loading ? 'Updating...' : 'Update') : loading ? 'Adding...' : 'Add'}
					</Button>

					{error && <p style={{ color: 'red' }}>{error}</p>}
				</DialogActions>
			</Dialog>
		</div>
	);
}
