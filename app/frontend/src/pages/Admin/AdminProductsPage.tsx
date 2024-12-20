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
	FormControlLabel
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';

const ProductCRUDPage = () => {
	// Sample initial products
	const [products, setProducts] = useState([
		{
			productid: 1,
			name: 'Product 1',
			description: 'This is product 1',
			brand: 'Brand 1',
			model: 'Model 1',
			categoryId: 1,
			price: '100',
			quantity: 10,
			imageUrl: 'https://via.placeholder.com/150',
			isFeatured: true
		},
		{
			productid: 2,
			name: 'Product 2',
			description: 'This is product 2',
			brand: 'Brand 2',
			model: 'Model 2',
			categoryId: 2,
			price: '200',
			quantity: 5,
			imageUrl: 'https://via.placeholder.com/150',
			isFeatured: false
		}
	]);

	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		productid: -1,
		name: '',
		description: '',
		brand: '',
		model: '',
		categoryId: -1,
		price: '',
		quantity: -1,
		imageUrl: '',
		isFeatured: false
	});
	const [editMode, setEditMode] = useState(false);

	// Open modal for Add/Edit
	const handleOpen = (
		product: {
			productid: number;
			name: string;
			description: string;
			brand: string;
			model: string;
			categoryId: number;
			price: string;
			quantity: number;
			imageUrl: string;
			isFeatured: boolean;
		} | null = null
	) => {
		if (product) {
			setFormData(product);
			setEditMode(true);
		} else {
			setFormData({
				productid: -1,
				name: '',
				description: '',
				brand: '',
				model: '',
				categoryId: -1,
				price: '',
				quantity: -1,
				imageUrl: '',
				isFeatured: false
			});
			setEditMode(false);
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value
		});
	};

	// Handle Add/Edit Submit
	const handleSubmit = () => {
		if (editMode) {
			setProducts(products.map((product) => (product.productid === formData.productid ? formData : product)));
		} else {
			setProducts([
				...products,
				{ ...formData, productid: products.length ? Math.max(...products.map((p) => p.productid)) + 1 : 1 }
			]);
		}
		handleClose();
	};

	// Handle Delete
	const handleDelete = (productid) => {
		setProducts(products.filter((product) => product.productid !== productid));
	};

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant="h4" gutterBottom>
				Product Management
			</Typography>
			<Button variant="contained" color="primary" onClick={() => handleOpen()}>
				Add Product
			</Button>

			{/* Product Table */}
			<TableContainer component={Paper} style={{ marginTop: '20px' }}>
				<Table>
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
							<TableCell>Image</TableCell>
							<TableCell>Featured</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.map((product) => (
							<TableRow key={product.productid}>
								<TableCell>{product.productid}</TableCell>
								<TableCell>{product.name}</TableCell>
								<TableCell>{product.description}</TableCell>
								<TableCell>{product.brand}</TableCell>
								<TableCell>{product.model}</TableCell>
								<TableCell>{product.categoryId}</TableCell>
								<TableCell>${product.price}</TableCell>
								<TableCell>{product.quantity}</TableCell>
								<TableCell>
									<img
										src={product.imageUrl}
										alt={product.name}
										style={{ width: '50px', height: '50px' }}
									/>
								</TableCell>
								<TableCell>{product.isFeatured ? 'Yes' : 'No'}</TableCell>
								<TableCell>
									<IconButton color="primary" onClick={() => handleOpen(product)}>
										<Edit />
									</IconButton>
									<IconButton color="secondary" onClick={() => handleDelete(product.productid)}>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

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
					<TextField
						label="Category ID"
						name="categoryId"
						value={formData.categoryId}
						onChange={handleChange}
						fullWidth
						margin="normal"
						type="number"
					/>
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
						{editMode ? 'Update' : 'Add'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ProductCRUDPage;
