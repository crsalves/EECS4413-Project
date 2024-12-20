import ReusableTable from '../../components/Table/Table';
import ReusableModal from '../../components/Modal/Modal';
import { useState } from 'react';

import { Typography } from '@mui/material';

export interface ContactInfo {
	userId: number;
	name: string;
	email: string;
	phone?: string;
}

export default function ProfileContactSectionPage({ userData }) {
	const userContactInfo: ContactInfo = {
		userId: userData.userId,
		name: userData.name,
		email: userData.email,
		phone: userData.phone
	};

	const [user, setUser] = useState(userContactInfo);

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		userId: any;
		name: any;
		email: any;
		phone: any;
	}>({
		userId: '',
		name: '',
		email: '',
		phone: ''
	});
	const [editMode, setEditMode] = useState(false);

	const columns = [
		{ header: 'Name', field: 'name' },
		{ header: 'Email', field: 'email' },
		{ header: 'Phone', field: 'phone' }
	];

	const fields = [
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'email', label: 'Email', type: 'email' },
		{ name: 'phone', label: 'Phone', type: 'text' }
	];

	// Open Modal
	const handleOpen = (
		user: {
			userId: number;
			name: string;
			email: string;
			phone: string;
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
				phone: ''
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
			setUser(user.userId === formData.userId ? { ...formData } : user);
		} else {
			setUser({ ...formData, userId: user.userId + 1 });
		}
		handleClose();
	};

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant="h5">Contact Information</Typography>
			<ReusableTable columns={columns} data={[user]} onEdit={handleOpen} enableDelete={false} />

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
}
