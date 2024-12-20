import styles from './Address.module.css';

export default function Address({
	addressStreet,
	addressComplement,
	addressProvince,
	addressPostalCode,
	addressCountry
}) {
	return (
		<>
			<>
				<article>
					<div className={styles.profile}>
						<p>{addressStreet}</p>
						<p>{addressComplement}</p>
						<p>{addressProvince}</p>
						<p>{addressPostalCode}</p>
						<p>{addressCountry}</p>
					</div>
				</article>
			</>
		</>
	);
}
