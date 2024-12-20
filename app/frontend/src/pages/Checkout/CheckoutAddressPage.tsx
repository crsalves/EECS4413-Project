import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Divider,
	Radio,
	RadioGroup,
	FormControlLabel,
	TextField,
	Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useContext } from 'react';
import AuthenticationContext from '../../store/AuthenticationContext';

export default function CheckoutAddressPage({ onSelectAddress }) {
	const userContext = useContext(AuthenticationContext);

	const addressData = userContext.userAddress;

	const [selectedAddress, setSelectedAddress] = useState('');
	const [addresses, setAddresses] = useState(addressData);

	const [showAddForm, setShowAddForm] = useState(false);
	const [newAddress, setNewAddress] = useState({
		street: '',
		complement: '',
		city: '',
		province: '',
		country: '',
		postalCode: '',
		isDefault: false
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSelectAddress = (event) => {
		setSelectedAddress(event.target.value);
	};

	const handleAddNewAddress = () => {
		setShowAddForm(true);
		setError(null);
	};

	const handleSaveNewAddress = async () => {
		setLoading(true);
		setError(null);

		const newAddressData = {
			userId: userContext.user.userId,
			street: newAddress.street,
			complement: newAddress.complement,
			city: newAddress.city,
			province: newAddress.province,
			country: newAddress.country,
			postalCode: newAddress.postalCode,
			isDefault: 0
		};

		console.log('Creating new Address Data:', JSON.stringify(newAddressData));

		try {
			console.log('Creating new address:', `${window.config.apiUrl}/user/${userContext.user.userId}/address`);

			// insert token here

			const token = localStorage.getItem('token');
			const response = await fetch(`${window.config.apiUrl}/user/${userContext.user.userId}/address`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token!
				},
				body: JSON.stringify(newAddressData)
			});

			if (!response.ok) {
				throw new Error('Failed to save the address. Please try again.');
			}

			const result = await response.json();

			// Add the new address with its ID
			const updatedAddresses = [
				...(addresses || []),
				{
					userAddressId: result.data.userAddressId, // Get the ID returned from the API
					userId: userContext.user.userId, // Assuming userId is available in userContext
					...newAddress,
					isDefault: false
				}
			];

			console.log('New address created:', updatedAddresses);
			setAddresses(updatedAddresses);
			userContext.setUserAddressState(updatedAddresses);

			setShowAddForm(false);
			setNewAddress({
				street: '',
				complement: '',
				city: '',
				province: '',
				country: '',
				postalCode: '',
				isDefault: false
			});
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewAddress({ ...newAddress, [name]: value });
	};

	return (
		<Box maxWidth="800px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Address Selection
			</Typography>
			<Divider sx={{ mb: 2 }} />

			{/* Address List */}
			<RadioGroup value={selectedAddress} onChange={handleSelectAddress}>
				{addresses?.map((address) => (
					<Card key={address.userAddressId} variant="outlined" sx={{ mb: 2, boxShadow: 2 }}>
						<CardContent>
							<Box display="flex" justifyContent="space-between" alignItems="center">
								<Box>
									<Typography variant="body1" fontWeight="bold">
										{address.street} ({address.province})
										{address.isDefault && (
											<Typography variant="body2" color="text.secondary" component="span" ml={1}>
												Default
											</Typography>
										)}
									</Typography>
									<Typography color="text.secondary">
										{address.street}, {address.city}
									</Typography>
								</Box>
								<FormControlLabel
									value={address.userAddressId}
									control={<Radio />}
									label="Deliver to this address"
								/>
							</Box>
						</CardContent>
					</Card>
				))}
			</RadioGroup>

			{/* Add New Address Form */}
			{showAddForm && (
				<Card variant="outlined" sx={{ mb: 2, boxShadow: 2 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Add New Address
						</Typography>
						{error && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}
						<TextField
							fullWidth
							margin="normal"
							label="Street"
							name="street"
							value={newAddress.street}
							onChange={handleInputChange}
						/>
						<TextField
							fullWidth
							margin="normal"
							label="Complement"
							name="complement"
							value={newAddress.complement}
							onChange={handleInputChange}
						/>
						<TextField
							fullWidth
							margin="normal"
							label="City"
							name="city"
							value={newAddress.city}
							onChange={handleInputChange}
						/>
						<TextField
							fullWidth
							margin="normal"
							label="Province"
							name="province"
							value={newAddress.province}
							onChange={handleInputChange}
						/>
						<TextField
							fullWidth
							margin="normal"
							label="Country"
							name="country"
							value={newAddress.country}
							onChange={handleInputChange}
						/>
						<TextField
							fullWidth
							margin="normal"
							label="Postal Code"
							name="postalCode"
							value={newAddress.postalCode}
							onChange={handleInputChange}
						/>
						<Box textAlign="right" mt={2}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSaveNewAddress}
								disabled={loading}
							>
								{loading ? 'Saving...' : 'Save Address'}
							</Button>
						</Box>
					</CardContent>
				</Card>
			)}

			{/* Add New Address Button */}
			{!showAddForm && (
				<Box textAlign="center" mt={2}>
					<Button startIcon={<AddIcon />} color="primary" onClick={handleAddNewAddress}>
						New Address
					</Button>
				</Box>
			)}

			{/* Navigation Buttons */}
			<Box display="flex" justifyContent="space-between" mt={4}>
				<Button variant="text" color="inherit" disabled={true}></Button>
				<Button
					variant="contained"
					color="primary"
					disabled={!selectedAddress}
					onClick={() => {
						onSelectAddress(selectedAddress);
					}}
				>
					Continue
				</Button>
			</Box>
		</Box>
	);
}
