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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../store/CartContext';
import { currencyFormatter } from '../../utils/formatting';

export default function CartPage() {
	const cartContext = useContext(CartContext);
	const navigate = useNavigate();

	const [cartItems, setCartItems] = useState(cartContext.items);

	const handleRemoveItem = (id) => {
		setCartItems(cartItems.filter((item) => item.id !== id));
	};

	const cartTotal = cartContext.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

	return (
		<Box maxWidth="800px" margin="auto" mt={4}>
			<Typography variant="h4" gutterBottom>
				Your Shopping Cart
			</Typography>
			<Divider sx={{ mb: 2 }} />

			{cartItems.length > 0 ? (
				<>
					<List>
						{cartItems.map((item) => (
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

					<Box display="flex" justifyContent="flex-end" mt={3}>
						<Button
							variant="contained"
							color="primary"
							startIcon={<AddShoppingCartIcon />}
							onClick={() => {
								navigate('/checkout/root');
							}}
						>
							Proceed to Checkout
						</Button>
					</Box>
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
