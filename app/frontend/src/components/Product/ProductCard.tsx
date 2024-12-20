import { Typography, Card, CardContent, CardMedia } from '@mui/material';

export default function ProductItemCard({ product, onClick }) {
	return (
		<Card
			onClick={() => onClick(product)}
			variant="outlined"
			sx={{
				boxShadow: 3,
				transition: 'transform 0.3s ease-in-out',
				'&:hover': { transform: 'scale(1.05)', cursor: 'pointer' }
			}}
		>
			<CardMedia
				component="img"
				height="150"
				image={`${process.env.REACT_APP_API_URL}/${product.imageUrl}`}
				alt={product.name}
				style={{ objectFit: 'contain', padding: '16px' }}
			/>
			<CardContent>
				<Typography variant="h6" fontWeight="bold" gutterBottom>
					{product.name}
				</Typography>
				<Typography variant="body1" color="text.secondary" gutterBottom>
					${product.price}
				</Typography>
			</CardContent>
		</Card>
	);
}
