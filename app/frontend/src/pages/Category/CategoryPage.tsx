import { useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import CategoriesCard from '../../components/Category/CategoriesCard';
import { LOADER_PRODUCT_BY_CATEGORY } from './getProductByCategoryLoader';

import ProductItemCard from '../../components/Product/ProductCard';
import SortHelper from '../../components/SortHelper/SortHelper';
import { Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CategoryPage() {
	const loaderData = useRouteLoaderData(LOADER_PRODUCT_BY_CATEGORY) as {
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
	};

	const productsData = loaderData.products.data;
	const categoriesData = loaderData.categories.data;

	const navigate = useNavigate();

	const handleProductClick = (product) => {
		navigate(`/catalog/product/${product.productId}`, { state: { product } });
	};

	const [sortAttribute, setSortAttribute] = useState<string>('price');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const handleSortAttributeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSortAttribute(event.target.value);
	};

	const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(event.target.value as 'asc' | 'desc');
	};

	const sortedProducts = productsData.sort((a, b) => {
		if (sortOrder === 'asc') {
			return a[sortAttribute] > b[sortAttribute] ? 1 : -1;
		} else {
			return a[sortAttribute] < b[sortAttribute] ? 1 : -1;
		}
	});

	const sortOptions = [
		{ value: 'brand', label: 'Brand' },
		{ value: 'categoryId', label: 'Category ID' },
		{ value: 'price', label: 'Price' }
	];

	return (
		<div>
			<div>
				<ul>
					{categoriesData.map(
						(category: { categoryId: number; name: string; description: string | null }) => (
							<CategoriesCard key={category.categoryId} category={category}></CategoriesCard>
						)
					)}
				</ul>
			</div>

			<SortHelper
				sortAttribute={sortAttribute}
				sortOrder={sortOrder}
				sortOptions={sortOptions}
				onSortAttributeChange={handleSortAttributeChange}
				onSortOrderChange={handleSortOrderChange}
			/>

			<Box maxWidth="1200px" margin="auto" mt={4}>
				<Typography variant="h3" textAlign="center" gutterBottom>
					Pet Store Products
				</Typography>
				<Typography variant="h6" color="text.secondary" textAlign="center" mb={4}>
					Find the best products for your pets
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
