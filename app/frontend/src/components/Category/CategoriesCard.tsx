/**
 * This component is used in the CATEGORY PAGE (CategoryPage.tsx) to display the category cards dynamically from database.
 */
import { Link } from 'react-router-dom';
import styles from './CategoriesCard.module.css';

export default function CategoriesCard(props) {
	return (
		<div className={styles.category}>
			<Link to={`/catalog/category/${props.category.categoryId}`} className={styles.column}>
				<li>{props.category.name}</li>
			</Link>
		</div>
	);
}
