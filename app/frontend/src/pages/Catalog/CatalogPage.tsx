import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductItemCard from '../../components/Product/ProductCard';
import {
	Box,
	Button,
	Typography,
	Tabs,
	Tab,
	Grid,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
	TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CatalogMainPage() {
	const loaderData = useLoaderData() as {
		products: {
			data: {
				productId: number;
				name: string;
				description: string | null;
				brand: string | null;
				model: string | null;
				categoryId: number | null;
				price: string;
				quantity: number;
				imageUrl: string | null;
				isFeatured: boolean;
				createdAt: string;
				updatedAt: string;
			}[];
		};
		categories: { data: { categoryId: number; name: string; description: string | null }[] };
		query: string | null;
	};

	const productsData = loaderData.products.data;
	const categoriesData = loaderData.categories.data;

	const navigate = useNavigate();

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [sortCriteria, setSortCriteria] = useState('price');
	const [searchQuery, setSearchQuery] = useState('');

	const handleSortChange = (event) => {
		setSortCriteria(event.target.value);
	};

	const handleProductClick = (product) => {
		navigate(`/catalog/product/${product.productId}`, { state: { product } });
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

	const toggleSortOrder = () => {
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
	};

	const sortedProducts = [...productsData].sort((a, b) => {
		const valueA = a[sortCriteria];
		const valueB = b[sortCriteria];
		if (typeof valueA === 'string') {
			return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
		}
		return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
	});

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

			{/* Sorting Controls */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id="sort-label">Sort By</InputLabel>
					<Select labelId="sort-label" value={sortCriteria} label="Sort By" onChange={handleSortChange}>
						<MenuItem value="price">Price</MenuItem>
						<MenuItem value="name">Name</MenuItem>
						<MenuItem value="brand">Brand</MenuItem>
					</Select>
				</FormControl>
				<Button variant="outlined" onClick={toggleSortOrder}>
					Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
				</Button>
			</Box>

			<Box maxWidth="1200px" margin="auto" mt={4}>
				<Typography variant="h3" textAlign="center" gutterBottom>
					Cyber Store Products
				</Typography>
				<Typography variant="h6" color="text.secondary" textAlign="center" mb={4}>
					Find the best products for your pets!
				</Typography>

				<Grid container spacing={4}>
					{sortedProducts.map((product) => (
						<Grid item xs={12} sm={6} md={4} key={product.productId}>
							<ProductItemCard product={product} onClick={handleProductClick} />
						</Grid>
					))}
				</Grid>
			</Box>
		</div>
	);
}
