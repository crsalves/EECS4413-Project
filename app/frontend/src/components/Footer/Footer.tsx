import Copyright from '../Copyright/Copyright';
import styles from './Footer.module.css';

export function Footer() {
	return (
		<footer className={styles.footerContainer}>
			<Copyright />
		</footer>
	);
}
