import HeaderBar from './HeaderBar';
import styles from './Header.module.css';

export function Header() {
	return (
		<div className={styles.headerContainer}>
			<HeaderBar />
		</div>
	);
}
