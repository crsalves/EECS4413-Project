/**
 * This component is used in the HOME PAGE (HomePage.tsx) to display the category cards dynamically from database.
 */
import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';


export default function CategoryCard({ categoryId, name, description, imageUrl }) {
	return (
		<div className={styles.category}>
			<Link to={`/catalog/category/${categoryId}`} className={styles.categoryLink}>
				<img src={imageUrl} alt={name} className={styles.categoryImage} />
				<h3>{name}</h3>
				<p>{description}</p>
			</Link>
		</div>
	);
}
