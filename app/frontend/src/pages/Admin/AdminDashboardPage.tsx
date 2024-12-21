import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import styles from './AdminDashboardPage.module.css';

export default function AdminDashboardPage() {
	return (
		<div className={styles.adminContainer}>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Card variant="outlined">
						<CardContent className={styles.cardContent}>
							<Typography variant="h4">Top Selling Products</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Card variant="outlined">
						<CardContent className={styles.cardContent}>
							<Typography variant="h4">Low Inventory Products</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Card variant="outlined">
						<CardContent className={styles.cardContent}>
							<Typography variant="h4">Today Sales</Typography>
							<Typography variant="h5">154</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
}
