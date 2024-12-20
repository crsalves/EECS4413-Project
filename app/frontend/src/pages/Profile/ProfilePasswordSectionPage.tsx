import ReusableModal from '../../components/Modal/Modal';
import { useState } from 'react';
import { Button } from '@mui/material';

export default function ProfilePasswordSectionPage({ userData }) {
	const userSecurityInfo = {
		userId: userData.userId,
		email: userData.email,
		passwordHash: userData.passwordHash
	};

	const [user, setUser] = useState(userSecurityInfo);

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		userId: any;
		email: any;
		passwordHash: any;
	}>({
		userId: '',
		email: '',
		passwordHash: ''
	});
	const [editMode, setEditMode] = useState(false);

	// const columns = [{ header: 'Password', field: 'passwordHash' }];

	const fields = [
		{ name: 'passwordHash', label: 'Password', type: 'passwordHash' },
		{ name: 'newPassword', label: 'New Password', type: 'text' },
		{ name: 'confirmNewPassword', label: 'Confirm New Password', type: 'text' }
	];

	// Open Modal
	const handleOpen = (
		user: {
			userId: number;
			email: string;
			passwordHash: string;
		} | null = null
	) => {
		if (user) {
			setFormData({ ...user, userId: user.userId || 0 });
			setEditMode(true);
		} else {
			setFormData({
				userId: '',
				email: '',
				passwordHash: ''
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
			{/* <ReusableTable columns={columns} data={[user]} onEdit={handleOpen} enableDelete={false} /> */}
			<Button onClick={() => handleOpen()}>Change Password</Button>

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
