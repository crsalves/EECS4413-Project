import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Divider,
	List,
	ListItemText,
	IconButton,
	CardMedia
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../store/CartContext';
import { currencyFormatter } from '../../utils/formatting';
import AuthenticationContext from 'src/store/AuthenticationContext';

export default function CheckoutSummaryPage() {
	const cartContext = useContext(CartContext);
	const userContext = useContext(AuthenticationContext);
	const navigate = useNavigate();

	const cartTotal = cartContext.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

	const [cartItems, setCartItems] = useState(cartContext.items);

	const handleRemoveItem = (id) => {
		setCartItems(cartItems.filter((item) => item.id !== id));
	};

	const handleNavigateToLogin = () => {
		localStorage.setItem('previousPath', window.location.pathname);
		navigate('/login');
	};

	const handleNavigateToRegistration = () => {
		localStorage.setItem('previousPath', window.location.pathname);
		navigate('/registration');
	};

	return (
		<Box maxWidth="800px" margin="auto" mt={4}>
			{userContext.isLoggedInContext ? (
				<Box>
					<Typography variant="h4" gutterBottom>
						Welcome back, {userContext.user.name}!
					</Typography>
					<Typography variant="h6" color="text.secondary">
						Here's what you have in your cart:
					</Typography>
				</Box>
			) : (
				<Box textAlign="center" mb={4}>
					<Typography variant="h4" gutterBottom>
						Welcome to Our Store!
					</Typography>
					<Typography variant="h6" color="text.secondary" mb={2}>
						Please log in or register to continue.
					</Typography>
					<Box display="flex" justifyContent="center" gap={2}>
						<Button variant="contained" color="primary" onClick={handleNavigateToLogin}>
							Already a member? Click here
						</Button>
						<Button variant="outlined" color="primary" onClick={handleNavigateToRegistration}>
							Register
						</Button>
					</Box>
				</Box>
			)}

			{cartContext.items.length > 0 ? (
				<>
					<List>
						{cartContext.items.map((item) => (
							<Card
								key={item.id}
								variant="outlined"
								sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
							>
								<CardMedia
									component="img"
									image={`${window.config.apiUrl}/${item.imageUrl}`}
									alt={item.name}
									sx={{ width: 100, height: 100, objectFit: 'cover' }}
								/>
								<CardContent
									sx={{
										flex: 1,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center'
									}}
								>
									<Box display="flex" justifyContent="space-between" alignItems="center">
										<ListItemText
											primary={
												<Typography variant="h6" fontWeight="bold">
													{item.name}
												</Typography>
											}
											secondary={`Price: $${item.price.toFixed(2)} each`}
										/>
										<Box display="flex" alignItems="center" justifyContent="center" minWidth={150}>
											<IconButton color="primary" onClick={() => cartContext.removeItem(item.id)}>
												<RemoveIcon />
											</IconButton>
											<Typography>{item.quantity}</Typography>
											<IconButton
												color="primary"
												onClick={() =>
													cartContext.addItem({
														id: item.id,
														name: item.name,
														price: +item.price,
														imageUrl: item.imageUrl,
														description: item.description
													})
												}
											>
												<AddIcon />
											</IconButton>
										</Box>
										<IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
											<DeleteIcon />
										</IconButton>
									</Box>
								</CardContent>
							</Card>
						))}
					</List>

					<Divider sx={{ mt: 2, mb: 2 }} />
					<Typography variant="h6" textAlign="right">
						Total: {currencyFormatter.format(cartTotal)}
					</Typography>
				</>
			) : (
				<Box textAlign="center" mt={4}>
					<Typography variant="h6" textAlign="center" color="text.secondary">
						Your cart is empty. Start shopping now!
					</Typography>
					<Button
						onClick={() => {
							navigate('/catalog');
						}}
						variant="contained"
					>
						Shop
					</Button>
				</Box>
			)}
		</Box>
	);
}
