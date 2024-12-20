import { Outlet } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer';
import { Header } from '../../components/Header/Header';
import styles from './RootPage.module.css';

export function RootPage() {
	return (
		<div className={styles.root}>
			<Header />
			<main className={styles.rootContainer}>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
