import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	IconButton,
	Typography,
	Checkbox,
	FormControlLabel,
	DialogContentText,
	Select,
	MenuItem,
	FormControl,
	InputLabel
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import styles from './AdminProductsPage.module.css';

const ProductCRUDPage = () => {
	const loaderData = useLoaderData() as {
		products: {
			data: {
				productId: string;
				name: string;
				description: string;
				brand: string;
				model: string;
				categoryId: string;
				price: string;
				quantity: string;
				imageUrl: string;
				isFeatured: boolean;
			}[];
		};
		categories: { data: { categoryId: number; name: string; description: string | null }[] };
		query: string | null;
	};

	const productsData = loaderData.products.data;
	const categoriesData = loaderData.categories.data;
	const productBrands = productsData.map((product) => product.brand);

	// Sample initial products
	const [products, setProducts] = useState(productsData);

	const [error, setError] = useState<String | null>();
	const [loading, setLoading] = useState(false);

	const [successDialogOpen, setSuccessDialogOpen] = useState(false);
	const [filterBrand, setFilterBrand] = useState('');
	const [filterCategory, setFilterCategory] = useState('');

	const handleCloseSuccessDialog = () => {
		setSuccessDialogOpen(false);
	};

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		productId: '',
		name: '',
		description: '',
		brand: '',
		model: '',
		categoryId: '',
		price: '',
		quantity: '',
		imageUrl: '',
		isFeatured: false
	});
	const [editMode, setEditMode] = useState(false);

	// Open modal for Add/Edit
	const handleOpen = (
		product: {
			productId: string;
			name: string;
			description: string;
			brand: string;
			model: string;
			categoryId: string;
			price: string;
			quantity: string;
			imageUrl: string;
			isFeatured: boolean;
		} | null = null
	) => {
		setError('');
		if (product) {
			setFormData({
				...product,
				productId: product.productId
			});
			setEditMode(true);
		} else {
			setFormData({
				productId: '',
				name: '',
				description: '',
				brand: '',
				model: '',
				categoryId: '',
				price: '',
				quantity: '',
				imageUrl: '',
				isFeatured: false
			});
			setEditMode(false);
		}
		setOpen(true);
	};

	const handleClose = () => {
		setError('');
		setOpen(false);
	};

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : name === 'isFeatured' ? Boolean(value) : value
		});
	};

	// Handle Add/Edit Submit
	const handleSubmit = async () => {
		const currentFormData = {
			name: formData.name,
			description: formData.description,
			brand: formData.brand,
			model: formData.model,
			categoryId: +formData.categoryId,
			price: +formData.price,
			quantity: +formData.quantity,
			imageUrl: formData.imageUrl,
			isfeatured: formData.isFeatured
		};

		const token = localStorage.getItem('token');

		if (editMode) {
			try {
				const updatedData = { ...currentFormData, productId: formData.productId };

				console.log('Updating product ', JSON.stringify(updatedData));
				const response = await fetch(`${process.env.REACT_APP_API_URL}/product/${formData.productId}`, {
					method: 'PUT',
					body: JSON.stringify(updatedData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: token!
					}
				});

				if (response.ok) {
					console.log('The response was okay', response.json());

					setProducts(
						products.map((product) => (product.productId === formData.productId ? formData : product))
					);

					handleClose();
				} else {
					console.log('The response was not  okay', response.json());
					throw new Error('Failed to submit the order');
				}
			} catch (err: Error | any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		} else {
			try {
				console.log('Adding product ', JSON.stringify(currentFormData));
				const response = await fetch(`${process.env.REACT_APP_API_URL}/product`, {
					method: 'POST',
					body: JSON.stringify(currentFormData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: token!
					}
				});

				if (response.ok) {
					const responseData = await response.json();
					const newProductId = responseData?.data.productId;
					console.log('The response was okay', responseData);

					setProducts([
						...products,
						{
							...formData,
							productId: newProductId
						}
					]);

					handleClose();

					setSuccessDialogOpen(true); // Show success dialog
				} else {
					const responseData = await response.json();
					console.log('The response was not okay', responseData?.message);

					setError(responseData?.message);
				}
			} catch (err: Error | any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
	};

	// Handle Delete
	const handleDelete = async (productId) => {
		setError('');
		try {
			const token = localStorage.getItem('token');
			console.log('Deleting product ', `${process.env.REACT_APP_API_URL}/product/${productId}`);
			const response = await fetch(`${process.env.REACT_APP_API_URL}/product/${productId}`, {
				method: 'DELETE',
				headers: {
					Authorization: token!
				},
				body: ''
			});

			if (response.ok) {
				console.log('The response was okay', response.json());

				setProducts(products.filter((product) => product.productId !== productId));
			} else {
				const responseData = await response.json();
				console.log('The response was not okay', responseData?.message);

				setError(responseData?.message);
			}
		} catch (err: Error | any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterBrandChange = (event) => {
		setFilterBrand(event.target.value as string);
	};

	const handleFilterCategoryChange = (event) => {
		setFilterCategory(event.target.value as string);
	};

	const filteredProducts = products.filter((product) => {
		return (
			(filterBrand === '' || product.brand === filterBrand) &&
			(filterCategory === '' || parseInt(product.categoryId) === parseInt(filterCategory, 10))
		);
	});

	// Define filter options
	const brandOptions = productBrands;
	const categoryOptions = categoriesData.filter((category) => category.name !== 'All');

	//create a map for category id and name from the categoriesData
	//use the map to display the category name in the table

	const categoryMap = new Map();
	categoriesData.forEach((category) => {
		categoryMap.set(category.categoryId, category.name);
	});

	return (
		<div className={styles.inventoryContainer}>
			<div className={styles.filterContainer}>
				<FormControl variant="outlined" className={styles.formControl}>
					<InputLabel>Filter by Brand</InputLabel>
					<Select value={filterBrand} onChange={handleFilterBrandChange} label="Filter by Brand">
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{brandOptions.map((brand) => (
							<MenuItem key={brand} value={brand}>
								{brand}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl variant="outlined" className={styles.formControl}>
					<InputLabel>Filter by Category ID</InputLabel>
					<Select value={filterCategory} onChange={handleFilterCategoryChange} label="Filter by Category ID">
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{categoryOptions.map((category) => (
							<MenuItem key={category.categoryId} value={category.categoryId}>
								{category.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<Typography variant="h4" gutterBottom>
				Product Management
			</Typography>
			{error && <p className={styles.error}>{error}</p>}
			<Button variant="contained" className={styles.primaryButton} onClick={() => handleOpen()}>
				Add Product
			</Button>

			{/* Product Table */}
			<TableContainer component={Paper} className={styles.tableContainer}>
				<Table className={styles.table}>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Brand</TableCell>
							<TableCell>Model</TableCell>
							<TableCell>Category ID</TableCell>
							<TableCell>Price</TableCell>
							<TableCell>Quantity</TableCell>
							<TableCell>ImageUrl</TableCell>
							<TableCell>Featured</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredProducts.map((product) => (
							<TableRow key={product.productId}>
								<TableCell>{product.productId}</TableCell>
								<TableCell>{product.name}</TableCell>
								<TableCell>{product.description}</TableCell>
								<TableCell>{product.brand}</TableCell>
								<TableCell>{product.model}</TableCell>
								<TableCell>{categoryMap.get(product.categoryId)}</TableCell>
								<TableCell>${product.price}</TableCell>
								<TableCell>{product.quantity}</TableCell>
								<TableCell>
									<img
										src={`${process.env.REACT_APP_API_URL}/${product.imageUrl}`}
										className={styles.productImage}
									/>
								</TableCell>
								<TableCell>{product.isFeatured ? 'Yes' : 'No'}</TableCell>
								<TableCell>
									<IconButton color="primary" onClick={() => handleOpen(product)}>
										<Edit />
									</IconButton>
									<IconButton color="secondary" onClick={() => handleDelete(product.productId)}>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Success Dialog */}
			<Dialog open={successDialogOpen} onClose={handleCloseSuccessDialog}>
				<DialogTitle>Product Created</DialogTitle>
				<DialogContent>
					<DialogContentText>The product has been created successfully.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseSuccessDialog} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
				<DialogContent>
					<TextField
						label="Name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Brand"
						name="brand"
						value={formData.brand}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Model"
						name="model"
						value={formData.model}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel>Category</InputLabel>
						<Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Category">
							{categoryOptions.map((category) => (
								<MenuItem key={category.categoryId} value={category.categoryId}>
									{category.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="Price"
						name="price"
						value={formData.price}
						onChange={handleChange}
						fullWidth
						margin="normal"
						type="number"
					/>
					<TextField
						label="Quantity"
						name="quantity"
						value={formData.quantity}
						onChange={handleChange}
						fullWidth
						margin="normal"
						type="number"
					/>
					<TextField
						label="Image URL"
						name="imageUrl"
						value={formData.imageUrl}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<FormControlLabel
						control={<Checkbox checked={formData.isFeatured} onChange={handleChange} name="isFeatured" />}
						label="Featured Product"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						{editMode ? (loading ? 'Updating..' : 'Update') : loading ? 'Adding..' : 'Add'}
						{error && <p style={{ color: 'red' }}>{error}</p>}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ProductCRUDPage;
