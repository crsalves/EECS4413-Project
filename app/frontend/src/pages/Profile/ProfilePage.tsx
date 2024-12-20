import Typography from '@mui/material/Typography';
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
		<div>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Card variant="outlined" onClick={() => navigate(`/user/${userId}/account`)}>
						<CardContent>
							<Typography variant="h4">Account Info</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Card variant="outlined" onClick={() => navigate(`/user/${userId}/address`)}>
						<CardContent>
							<Typography variant="h4">Address </Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Card variant="outlined" onClick={() => navigate(`/user/${userId}/billing`)}>
						<CardContent>
							<Typography variant="h4">Billing</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
}
