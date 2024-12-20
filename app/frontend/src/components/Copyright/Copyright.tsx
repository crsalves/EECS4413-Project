import { Link } from 'react-router-dom';
import styles from './Copyright.module.css';

export default function Copyright() {
	return (
		<div className={styles.copyrightContainer}>
			Copyright ©
			<Link className={styles.companyName} to="/">
				Cyber Pets
			</Link>{' '}
			{new Date().getFullYear()}
		</div>
	);
}
