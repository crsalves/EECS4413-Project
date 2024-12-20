import { Link, useLoaderData } from 'react-router-dom';
import CategoryCard from '../../components/Category/CategoryCard';

import styles from './HomePage.module.css';

export function HomePage() {
	const loaderData = useLoaderData() as {
		categories: {
			data: { categoryId: number; name: string; description: string | null; imageUrl: string | null }[];
		};
	};

	const categoriesData = loaderData.categories.data;

	// variable to hold the images path 'http://localhost:8080/assets/images/banners/homepage'
	const IMAGE_PATH = 'http://localhost:8080/assets/images/banners/homepage';

	return (
		<div className={styles.homeContainer}>
			<section className={styles.bannerSection}>
				<div className={styles.bannerImageLeft}>
					<img src={IMAGE_PATH + '/bannerLeft.png'} alt="Left Banner Image" />
				</div>
				<div className={styles.bannerContent}>
					<h1 className={styles.companyName}>Cyber Pet&apos;s</h1>
					<h2>Get your pet's supplies in clicks</h2>
				</div>
				<div className={styles.bannerImageRight}>
					<img src={IMAGE_PATH + '/bannerRight.png'} alt="Right Banner Image" />
				</div>
			</section>

			<section className={styles.highlightsContainer}>
				<h2>Check Our Highlights</h2>
				<div className={styles.highlights}>
					<div className={styles.highlight}>
						<img src={IMAGE_PATH + '/premium.png'} alt="Background" className={styles.highlightImage} />

						<h3>Shop Premium Products</h3>
						<p>Explore our wide range of high-quality pet products.</p>
						<Link to="#shop" className={styles.btn}>
							Shop Now
						</Link>
					</div>
					<div className={styles.highlight}>
						<img src={IMAGE_PATH + '/deals.png'} alt="Background" className={styles.highlightImage} />

						<h3>Exclusive Deals</h3>
						<p>Check out our weekly specials and discounts.</p>
						<Link to="#shop" className={styles.btn}>
							View Deals
						</Link>
					</div>
					<div className={styles.highlight}>
						<img src={IMAGE_PATH + '/supplies.png'} alt="Background" className={styles.highlightImage} />

						<h3>Healthy Pets, Happy Owners</h3>
						<p>Read our guides to keep your pet healthy and happy.</p>
						<a href="#learn-more" className={styles.btn}>
							Learn More
						</a>
					</div>
				</div>
			</section>
			<section className={styles.categoriesContainer}>
				<Link to="/catalog" className={styles.categoriesTitle}>
					Explore All Categories
				</Link>

				<div className={styles.categories}>
					{categoriesData.map(
						(category: {
							categoryId: number;
							name: string;
							description: string | null;
							imageUrl: string | null;
						}) => (
							<CategoryCard
								key={category.categoryId}
								categoryId={category.categoryId}
								name={category.name}
								description={category.description}
								imageUrl={category.imageUrl || IMAGE_PATH + '/logo-background.png'}
							></CategoryCard>
						)
					)}
				</div>
			</section>
		</div>
	);
}
