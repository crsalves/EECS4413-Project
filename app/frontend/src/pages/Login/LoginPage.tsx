import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import AuthenticationContext from '../../store/AuthenticationContext';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

export interface User {
	userId: number;
	name: string;
	email: string;
	phone?: string;
	role?: 'customer' | 'admin';
}

export default function LoginPage() {
	const userContext = useContext(AuthenticationContext);
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		setErrorMessage('');
		setLoading(true);

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.log('Error from the api', errorData);
				setErrorMessage(errorData.message || 'Login failed');
				return;
			}

			const userData = await response.json();
			const token = userData.token;

			const user = userData.user;
			const userAddress = userData.userAddress;
			const userPayment = userData.userPayment;

			if (token !== null && token!) {
				userContext.onLogin(token, user, userAddress, userPayment);
				// Retrieve the previous path from local storage
				const previousPath = localStorage.getItem('previousPath') || '/';
				localStorage.removeItem('previousPath'); // Optionally remove it after use

				// Navigate to the previous path or default to '/'
				navigate(previousPath);
			} else {
				userContext.onLogout();
			}
		} catch (error) {
			setErrorMessage('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm">
			{userContext.isLoggedInContext ? (
				<Typography variant="h6">You are already logged in</Typography>
			) : (
				<Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
					<Typography variant="h4" component="h1" gutterBottom>
						Log in
					</Typography>
					{errorMessage && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{errorMessage}
						</Alert>
					)}
					<TextField
						id="email"
						label="Email"
						type="email"
						name="email"
						fullWidth
						required
						autoFocus
						margin="normal"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						id="password"
						label="Password"
						type="password"
						name="password"
						fullWidth
						required
						margin="normal"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<Box textAlign="center" mt={3}>
						{loading ? (
							<CircularProgress />
						) : (
							<Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
								Log in
							</Button>
						)}
					</Box>

					<Box sx={{ mt: 2 }}>
						<div className={styles.link}>
							<Link to="#" className={styles.link}>
								Forgot password?
							</Link>
							<Link to="/registration" className={styles.link}>
								Don't have an account?
							</Link>
						</div>
					</Box>
				</Box>
			)}
		</Container>
	);
}
