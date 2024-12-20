import { Link } from 'react-router-dom';
import styles from './CategoriesCard.module.css';

export default function CategoriesCard(props) {
	return (
		<Link to={`/catalog/category/${props.category.categoryId}`} className={styles.column}>
			<li>{props.category.name}</li>
		</Link>
	);
}
