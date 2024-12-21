import {
	Button,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText
} from '@mui/material';
import ReusableTable from '../../components/Table/Table';
import ReusableModal from '../../components/Modal/Modal';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import styles from './AdminUsersPage.module.css';

export interface User {
	userId: string;
	name: string;
	email: string;
	password: string;
	phone: string;
	role: string;
}

const UserCRUDPage = () => {
	const loaderData = useLoaderData() as {
		message: string;
		data: User[];
	};

	const allData = loaderData.data;
	const adminUserData = allData.filter((user) => user.role === 'admin');

	const [users, setUsers] = useState(adminUserData);
	const [error, setError] = useState<String | null>();
	const [loading, setLoading] = useState(false);
	const [successDialogOpen, setSuccessDialogOpen] = useState(false);

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		userId: any;
		name: any;
		email: any;
		password: any;
		phone: any;
		role: any;
	}>({
		userId: '',
		name: '',
		email: '',
		password: '',
		phone: '',
		role: 'user'
	});
	const [editMode, setEditMode] = useState(false);

	const handleCloseSuccessDialog = () => {
		setSuccessDialogOpen(false);
	};

	const columns = [
		{ header: 'ID', field: 'userId' },
		{ header: 'Name', field: 'name' },
		{ header: 'Email', field: 'email' },
		{ header: 'Phone', field: 'phone' },
		{ header: 'Role', field: 'role' }
	];

	const fields = [
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'email', label: 'Email', type: 'email' },
		{ name: 'password', label: 'Password', type: 'password' },
		{ name: 'phone', label: 'Phone', type: 'text' }
	];

	// Open Modal
	const handleOpen = (
		user: {
			userId: string;
			name: string;
			email: string;
			password: string;
			phone: string;
			role: string;
		} | null = null
	) => {
		if (user) {
			setError('');
			setFormData({ ...user, userId: user.userId || 0 });
			setEditMode(true);
		} else {
			setFormData({
				userId: '',
				name: '',
				email: '',
				password: '',
				phone: '',
				role: 'admin'
			});
			setEditMode(false);
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	// Handle input changes
	const handleChange = (e) => {
		setError('');
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Add or Update User
	const handleSubmit = async () => {
		setError('');
		const currentFormData = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			phone: formData.phone,
			role: 'admin'
		};

		const token = localStorage.getItem('token');

		if (editMode) {
			try {
				const updatedData = { ...currentFormData, userId: formData.userId };

				console.log('Updating user ', JSON.stringify(updatedData));

				const response = await fetch(`${process.env.REACT_APP_API_URL}/user/admin/${formData.userId}`, {
					method: 'PUT',
					body: JSON.stringify(updatedData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: token!
					}
				});

				if (response.ok) {
					console.log('The response was okay', response.json());
					setUsers(users.map((user) => (user.userId === formData.userId ? { ...formData } : user)));
					handleClose();
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
			try {
				const newUserData = {
					name: formData.name,
					email: formData.email,
					password: formData.password,
					phone: formData.phone,
					role: 'admin'
				};

				console.log('Adding user ', JSON.stringify(newUserData), 'Here is the token', token);

				const response = await fetch(`${process.env.REACT_APP_API_URL}/user/admin`, {
					method: 'POST',
					body: JSON.stringify(newUserData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: token!
					}
				});

				if (response.ok) {
					const responseData = await response.json();
					const newUserId = responseData?.data.userId;
					console.log('The response was okay', responseData);

					setUsers([...users, { ...formData, userId: newUserId }]);

					handleClose();

					setSuccessDialogOpen(true); // Show success dialog
				} else {
					const responseData = await response.json();
					console.log('The response was not okay', responseData?.message);

					setError(responseData?.message);
				}
			} catch (err: Error | any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		handleClose();
	};

	// Delete User
	const handleDelete = async (userId) => {
		setError('');
		try {
			const token = localStorage.getItem('token');
			console.log('Deleting product ', `${process.env.REACT_APP_API_URL}/user/admin/${userId}`);
			const response = await fetch(`${process.env.REACT_APP_API_URL}/user/admin/${userId}`, {
				method: 'DELETE',
				headers: {
					Authorization: token!
				},
				body: ''
			});

			if (response.ok) {
				console.log('The response was okay', response.json());
				setUsers(users.filter((user) => user.userId !== userId));
			} else {
				const responseData = await response.json();
				console.log('The response was not okay', responseData?.message);

				setError(responseData?.message);
			}
		} catch (err: Error | any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.adminContainer}>
			<Typography variant="h4" gutterBottom>
				Admin Users Management
			</Typography>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<Button variant="contained" onClick={() => handleOpen()} className={styles.primaryButton}>
				{loading ? 'Adding Admin User..' : 'Add Admin User'}
			</Button>
			<div className={styles.tableContainer}>
				<ReusableTable columns={columns} data={users} onEdit={handleOpen} onDelete={handleDelete} />
			</div>
			<div className={styles.table}>
				<ReusableModal
					open={open}
					title={editMode ? 'Edit User' : 'Add User'}
					fields={fields}
					data={formData}
					onChange={handleChange}
					onClose={handleClose}
					onSubmit={handleSubmit}
				/>
			</div>
			{/* Success Dialog */}
			<Dialog open={successDialogOpen} onClose={handleCloseSuccessDialog}>
				<DialogTitle>User Created</DialogTitle>
				<DialogContent>
					<DialogContentText>The User has been created successfully.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseSuccessDialog} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default UserCRUDPage;
