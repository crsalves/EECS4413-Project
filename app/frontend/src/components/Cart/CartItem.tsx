import { currencyFormatter } from '../../utils/formatting';

import styles from './CartItem.module.css';

export default function CartItem({ name, price, imageUrl, quantity, onIncrease, onDecrease }) {
	return (
		<div>
			<li>
				<article>
					<img src={`${window.config.apiUrl}/${imageUrl}`} alt={name} className={styles.productImage} />
					<div>
						<h3>Name: {name}</h3>
						<p>Price: {currencyFormatter.format(+price)}</p>
						<p>
							{' '}
							Quantity: <button onClick={onDecrease}>-</button>
							<span>{quantity}</span>
							<button onClick={onIncrease}>+</button>
						</p>
						<p> Total for the product: {currencyFormatter.format(quantity * +price)}</p>
					</div>
				</article>
			</li>
		</div>
	);
}
