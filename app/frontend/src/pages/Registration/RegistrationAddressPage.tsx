import {
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	Select,
	MenuItem,
	FormControl,
	InputLabel
} from '@mui/material';
import { useState } from 'react';

export default function RegisterAddressPage({ addressData, handleAddAddress }) {
	const [addressInfo, setAddressInfo] = useState(addressData);
	const [errors, setErrors] = useState({ province: '', postalCode: '' });

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAddressInfo({ ...addressInfo, [name]: value });
		// Validation logic for province
		if (name === 'province') {
			const provinceRegex = /^[A-Z]{2}$/;
			setErrors({
				...errors,
				province: provinceRegex.test(value) ? '' : 'Invalid province. Expected format: ON or BC'
			});
		}

		// Validation logic for postal code
		if (name === 'postalCode') {
			const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
			setErrors({
				...errors,
				postalCode: postalCodeRegex.test(value) ? '' : 'Invalid postal code format. Expected format: A1A 1A1'
			});
		}
	};

	return (
		<Box maxWidth="600px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Register Your Account
			</Typography>
			<Typography variant="h6" gutterBottom>
				Enter Your Address Information
			</Typography>
			<Card variant="outlined">
				<CardContent>
					<TextField
						fullWidth
						margin="normal"
						label="Street Address"
						variant="outlined"
						name="street"
						value={addressInfo.street}
						onChange={handleInputChange}
						placeholder="123 Main St"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Complement"
						variant="outlined"
						name="complement"
						value={addressInfo.complement}
						onChange={handleInputChange}
						placeholder="123 Main St"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="City"
						variant="outlined"
						name="city"
						value={addressInfo.city}
						onChange={handleInputChange}
						placeholder="Los Angeles"
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Province"
						variant="outlined"
						name="province"
						value={addressInfo.province}
						onChange={handleInputChange}
						placeholder="ON"
						error={!!errors.province}
						helperText={errors.province}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Postal Code"
						variant="outlined"
						name="postalCode"
						value={addressInfo.postalCode}
						onChange={handleInputChange}
						placeholder="A1A 1A1"
						error={!!errors.postalCode}
						helperText={errors.postalCode}
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel>Country</InputLabel>
						<Select name="country" value={addressInfo.country} onChange={handleInputChange} label="Country">
							<MenuItem value="Canada">Canada</MenuItem>
							<MenuItem value="United States">United States</MenuItem>
							<MenuItem value="Mexico">Mexico</MenuItem>
						</Select>
					</FormControl>
					<Box textAlign="center" mt={2}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							onClick={() => {
								handleAddAddress(addressInfo, errors);
							}}
						>
							Proceed To Payment Information
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
