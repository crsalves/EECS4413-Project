import { Button, Typography } from '@mui/material';
import ReusableTable from '../../components/Table/Table';
import ReusableModal from '../../components/Modal/Modal';
import { useState } from 'react';

const UserCRUDPage = () => {
	const [users, setUsers] = useState([
		{
			userId: 1,
			name: 'John Doe',
			email: 'user@user.com',
			password: 'password',
			phone: '123-456-7890',
			addressStreet: '123 Main St',
			addressComplement: 'Apt 1',
			addressProvince: 'ON',
			addressCountry: 'Canada',
			addressPostalCode: 'A1A 1A1',
			role: 'admin'
		},
		{
			userId: 2,
			name: 'Jane Smith',
			email: 'jane@user.com',
			password: 'password123',
			phone: '987-654-3210',
			addressStreet: '456 Elm St',
			addressComplement: 'Suite 200',
			addressProvince: 'QC',
			addressCountry: 'Canada',
			addressPostalCode: 'B2B 2B2',
			role: 'user'
		}
	]);

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		userId: any;
		name: any;
		email: any;
		password: any;
		phone: any;
		addressStreet: any;
		addressComplement: any;
		addressProvince: any;
		addressCountry: any;
		addressPostalCode: any;
		role: any;
	}>({
		userId: '',
		name: '',
		email: '',
		password: '',
		phone: '',
		addressStreet: '',
		addressComplement: '',
		addressProvince: '',
		addressCountry: '',
		addressPostalCode: '',
		role: 'user'
	});
	const [editMode, setEditMode] = useState(false);

	const columns = [
		{ header: 'ID', field: 'userId' },
		{ header: 'Name', field: 'name' },
		{ header: 'Email', field: 'email' },
		{ header: 'Password', field: 'password' },
		{ header: 'Phone', field: 'phone' },
		{ header: 'Street', field: 'addressStreet' },
		{ header: 'Complement', field: 'addressComplement' },
		{ header: 'Province', field: 'addressProvince' },
		{ header: 'Country', field: 'addressCountry' },
		{ header: 'Postal Code', field: 'addressPostalCode' },
		{ header: 'Role', field: 'role' }
	];

	const fields = [
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'email', label: 'Email', type: 'email' },
		{ name: 'password', label: 'Password', type: 'password' },
		{ name: 'phone', label: 'Phone', type: 'text' },
		{ name: 'addressStreet', label: 'Street Address', type: 'text' },
		{ name: 'addressComplement', label: 'Complement', type: 'text' },
		{ name: 'addressProvince', label: 'Province', type: 'text' },
		{ name: 'addressCountry', label: 'Country', type: 'text' },
		{ name: 'addressPostalCode', label: 'Postal Code', type: 'text' },
		{
			name: 'role',
			label: 'Role',
			type: 'select',
			options: [
				{ value: 'admin', label: 'Admin' },
				{ value: 'user', label: 'User' }
			]
		}
	];

	// Open Modal
	const handleOpen = (
		user: {
			userId: number;
			name: string;
			email: string;
			password: string;
			phone: string;
			addressStreet: string;
			addressComplement: string;
			addressProvince: string;
			addressCountry: string;
			addressPostalCode: string;
			role: string;
		} | null = null
	) => {
		if (user) {
			setFormData({ ...user, userId: user.userId || 0 });
			setEditMode(true);
		} else {
			setFormData({
				userId: '',
				name: '',
				email: '',
				password: '',
				phone: '',
				addressStreet: '',
				addressComplement: '',
				addressProvince: '',
				addressCountry: '',
				addressPostalCode: '',
				role: 'user'
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
	const handleSubmit = () => {
		if (editMode) {
			setUsers(users.map((user) => (user.userId === formData.userId ? { ...formData } : user)));
		} else {
			setUsers([...users, { ...formData, userId: users.length + 1 }]);
		}
		handleClose();
	};

	// Delete User
	const handleDelete = (userId) => {
		setUsers(users.filter((user) => user.userId !== userId));
	};

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant="h4" gutterBottom>
				User Management
			</Typography>
			<Button variant="contained" color="primary" onClick={() => handleOpen()}>
				Add User
			</Button>

			<ReusableTable columns={columns} data={users} onEdit={handleOpen} onDelete={handleDelete} />

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
	);
};

export default UserCRUDPage;
