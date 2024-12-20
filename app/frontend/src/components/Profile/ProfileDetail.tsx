import styles from './ProfileDetail.module.css';

export default function ProfileDetail({ userId, email, name }) {
	return (
		<>
			<>
				<article>
					<div className={styles.profile}>
						<p>{userId}</p>
						<p>{email}</p>
						<p>{name}</p>
					</div>
				</article>
			</>
		</>
	);
}
