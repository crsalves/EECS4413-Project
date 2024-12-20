import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { LOADER_PRODUCT_ID } from './getProductIdLoader';
import { useContext, useState } from 'react';
import CartContext from '../../store/CartContext';
import { AddShoppingCart, RemoveShoppingCart } from '@mui/icons-material';

import {
	Container,
	Card,
	Grid,
	CardMedia,
	CardContent,
	Typography,
	Button,
	TextField,
	Box,
	Rating,
	Alert,
	Tabs,
	Tab
} from '@mui/material';

export default function ProductDetailViewPage() {
	// Fetch the product data from the loader
	const loaderDetailData = useRouteLoaderData(LOADER_PRODUCT_ID) as {
		product: {
			data: {
				productId: number;
				name: string;
				description: string;
				brand: string | null;
				model: string | null;
				categoryId: number | null;
				price: string;
				quantity: number;
				imageUrl: string;
				isFeatured: boolean;
				createdAt: string;
				updatedAt: string;
			};
		};
		categories: { data: { categoryId: number; name: string; description: string | null }[] };
	};

	const categoriesData = loaderDetailData.categories.data;

	const product = loaderDetailData.product.data;

	const cartContext = useContext(CartContext);
	const navigate = useNavigate();
	const [rating, setRating] = useState<number | null>(0);
	const [reviewText, setReviewText] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [searchQuery, setSearchQuery] = useState('');

	const handleSubmit = () => {
		if (!reviewText.trim() || rating === 0) {
			setError('Please provide both a rating and a review.');
			return;
		}

		console.log('Review Submitted:', {
			rating,
			review: reviewText
		});

		// Simulate API call here
		alert('Thank you for your review!');

		// Clear form after submission
		setRating(0);
		setReviewText('');
		setError(null);
	};
	const handleCategoryChange = (event, newValue) => {
		setSelectedCategory(newValue);
		if (newValue === 'All') {
			navigate('/catalog');
			return;
		}
		const categoryId = categoriesData.find((category) => category.name === newValue)?.categoryId;
		navigate(`/catalog/category/${categoryId}`);
	};

	// Handle "Enter" key press to start search
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			const value = event.target.value.trim();
			if (value) {
				console.log('this is the new query value');
				navigate(`/catalog/product/search/${value}`); // Update the URL query
			}
		}
	};

	return (
		<div>
			{/* Search Bar */}
			<Box mb={4} display="flex" justifyContent="center">
				<TextField
					label="Search Products"
					variant="outlined"
					value={searchQuery}
					onChange={handleSearchChange}
					onKeyDown={handleKeyDown}
					sx={{ width: '100%', maxWidth: 500 }}
				/>
			</Box>
			{/* Category Navigation */}
			<Tabs
				value={selectedCategory}
				onChange={handleCategoryChange}
				centered
				textColor="primary"
				indicatorColor="primary"
				sx={{ mb: 4 }}
			>
				{categoriesData.map((category) => (
					<Tab key={category.categoryId} label={category.name} value={category.name} />
				))}
			</Tabs>

			<Container maxWidth="md">
				<Box my={4}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={8}>
							<Card>
								<CardMedia
									component="img"
									height="300"
									image={`${window.config.apiUrl}/${product.imageUrl}`}
									alt={product.name}
									style={{ objectFit: 'contain', padding: '16px' }}
								/>
								<CardContent>
									<Typography variant="h5" component="div">
										{product.name}
									</Typography>
									<Typography variant="body2" color="text.secondary" paragraph>
										{product.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={4}>
							<Card>
								<CardContent>
									<Typography variant="h6" color="text.secondary">
										Price: ${product.price}
									</Typography>
									<Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
										<Button
											variant="contained"
											color="primary"
											startIcon={<RemoveShoppingCart />}
											onClick={() => cartContext.removeItem(product.productId)}
										>
											-
										</Button>
										<Button
											variant="contained"
											color="primary"
											startIcon={<AddShoppingCart />}
											onClick={() =>
												cartContext.addItem({
													id: product.productId,
													name: product.name,
													price: +product.price,
													imageUrl: product.imageUrl,
													description: product.description
												})
											}
										>
											+
										</Button>
									</Box>
									<Box mt={4} display="flex" flexDirection="column" alignItems="flex-start">
										<Button
											variant="contained"
											color="primary"
											onClick={() => navigate('/checkout/root')}
											fullWidth
											style={{ marginBottom: '8px' }}
										>
											Buy Now
										</Button>
										<Button
											variant="contained"
											color="secondary"
											onClick={() => navigate(-1)}
											fullWidth
										>
											Back to Catalog
										</Button>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>

				<Card>
					<CardContent>
						<Typography variant="h5" gutterBottom>
							Leave a Review
						</Typography>
						{error && <Alert severity="error">{error}</Alert>}
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Rating
									name="rating"
									value={rating}
									onChange={(event, newValue) => {
										setRating(newValue);
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Review"
									variant="outlined"
									fullWidth
									multiline
									rows={4}
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button variant="contained" color="primary" onClick={handleSubmit}>
									Submit Review
								</Button>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}

