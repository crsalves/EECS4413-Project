import { Card, CardContent, CardMedia, Typography, Button, Box, Grid } from '@mui/material';

export default function ProductDetail({ name, price, description, imageUrl, onIncrease, onDecrease }) {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={8}>
				<Card>
					<CardMedia
						component="img"
						height="300"
						image={`${window.config.apiUrl}/${imageUrl}`}
						alt={name}
						style={{ objectFit: 'contain', padding: '16px' }}
					/>
					<CardContent>
						<Typography variant="h5" component="div">
							{name}
						</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							{description}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<CardContent>
						<Typography variant="h6" color="text.secondary">
							Price: ${price}
						</Typography>
						<Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
							<Button variant="contained" color="primary" onClick={onDecrease}>
								-
							</Button>
							<Button variant="contained" color="primary" onClick={onIncrease}>
								+
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}
