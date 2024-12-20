import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';
import { useContext } from 'react';
import CartContext from 'src/store/CartContext';
import AuthenticationContext from 'src/store/AuthenticationContext';

export function Navigation() {
	const cartContext = useContext(CartContext);
	const userContext = useContext(AuthenticationContext);

	const totalCartItems = cartContext.items.reduce((totalNumberOfItems, item) => {
		return totalNumberOfItems + item.quantity;
	}, 0);
	return (
		<nav className={styles.navContainer}>
			<div className={styles.link}>
				<Link className={styles.link} to="/">
					Home
				</Link>
			</div>
			<div className={styles.link}>
				<Link className={styles.link} to="/catalog">
					Shop
				</Link>
			</div>

			<div className={styles.link}>
				<Link className={styles.link} to="/cart">
					Cart ({totalCartItems})
				</Link>
			</div>

			{!userContext.isLoggedInContext ? (
				<div className={styles.link}>
					<Link className={styles.link} to="/login">
						Login
					</Link>
				</div>
			) : (
				<>
					<div className={styles.link}>
						<Link className={styles.link} to={'user/' + userContext.user.userId}>
							Profile
						</Link>
					</div>
					<div className={styles.link}>
						<Link className={styles.link} onClick={userContext.onLogout} to="/">
							Logout
						</Link>
					</div>
				</>
			)}
			<div className={styles.link}>
				<Link className={styles.link} to={'/admin'}>
					Admin
				</Link>
			</div>
		</nav>
	);
}
