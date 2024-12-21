import Typography from '@mui/material/Typography';
import styles from './ProfilePage.module.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import AuthenticationContext from 'src/store/AuthenticationContext';
import { useContext } from 'react';

export default function ProfilePage() {
	const navigate = useNavigate();
	const userContext = useContext(AuthenticationContext);
	const userId = userContext.user.userId;
	return (
		<div className={styles.profileContainer}>
			<Grid container spacing={3}>
				<div className={styles.profileCardsContainer}>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<Card
							variant="outlined"
							onClick={() => navigate(`/user/${userId}/account`)}
							className={styles.profileCard}
						>
							<CardContent>
								<Typography variant="h4">Account Info</Typography>
							</CardContent>
						</Card>
					</Grid>
				</div>
				<div className={styles.profileCardsContainer}>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<Card
							variant="outlined"
							onClick={() => navigate(`/user/${userId}/address`)}
							className={styles.profileCard}
						>
							<CardContent>
								<Typography variant="h4">Address</Typography>
							</CardContent>
						</Card>
					</Grid>
				</div>
				<div className={styles.profileCardsContainer}>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<Card
							variant="outlined"
							onClick={() => navigate(`/user/${userId}/billing`)}
							className={styles.profileCard}
						>
							<CardContent>
								<Typography variant="h4">Billing</Typography>
							</CardContent>
						</Card>
					</Grid>
				</div>
			</Grid>
		</div>
	);
}
