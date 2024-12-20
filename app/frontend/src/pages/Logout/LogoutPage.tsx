// import { Form, Link, useActionData, useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

export default function LogoutPage() {
	return (
		<div className={styles.container}>
			<h2> Your session expired please log in again</h2>
		</div>
	);
}
