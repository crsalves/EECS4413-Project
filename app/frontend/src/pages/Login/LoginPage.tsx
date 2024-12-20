// import { Form, Link, useActionData, useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useContext, useEffect, useState } from 'react';
import { Form, Link, useActionData, useNavigate } from 'react-router-dom';
import AuthenticationContext from '../../store/AuthenticationContext';

export interface User {
	userId: number;
	name: string;
	email: string;
	phone?: string;

	role?: 'customer' | 'admin';
}

interface LoginActionData {
	token: string;
	user: User;
	userAddress?: any;
	userPayment?: any;
}

export default function LoginPage() {
	let errorMessage;
	const [error, setError] = useState<String>();
	const userContext = useContext(AuthenticationContext);
	const navigate = useNavigate();

	const loginActionData = useActionData() as LoginActionData;

	useEffect(() => {
		if (loginActionData && loginActionData.token && loginActionData.user) {
			const token = loginActionData.token;

			const user = loginActionData.user;
			const userAddress = loginActionData.userAddress;
			const userPayment = loginActionData.userPayment;

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
		} else if (loginActionData && loginActionData.user === undefined) {
			setError('Login failed - Username and password ...');
		}
	}, [loginActionData, userContext, navigate]);

	if (error) {
		errorMessage = <p>{error}</p>;
	}

	return (
		<div className={styles.container}>
			{userContext.isLoggedInContext}
			{!userContext.isLoggedInContext && (
				<div className={styles.formContainer}>
					<Form method="POST">
						<h2>Log in</h2>
						<div className={styles.message}>
							<section>{errorMessage}</section>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								name="email"
								pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+$" // TODO: add regex for preventing spaces
								required
								autoFocus
								placeholder="Enter your email"
							/>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="password">Password</label>
							<input
								id="password"
								type="password"
								name="password"
								pattern="[^\s]+"
								required
								autoComplete="current-password"
								placeholder="Enter your password"
							/>
						</div>

						<div className={styles.checkbox}>
							<input type="checkbox" id="remember" />
							<label htmlFor="remember">Remember me</label>
						</div>

						<div>
							<button className={styles.button} type="submit">
								Submit
							</button>
						</div>

						<div className={styles.link}>
							<Link to="#" className={styles.link}>
								Forgot password?
							</Link>
							<Link to="/registration" className={styles.link}>
								Don't have an account?
							</Link>
						</div>
					</Form>
				</div>
			)}
		</div>
	);
}
