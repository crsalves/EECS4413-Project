import styles from './Logo.module.css';

export function Logo() {
	return (
		<div className={styles.logoContainer}>
			<img src="/assets/logo.png" alt="Company Logo" className={styles.logo} />
		</div>
	);
}
