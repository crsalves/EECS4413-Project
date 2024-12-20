interface SortOption {
	value: string;
	label: string;
}

interface SortComponentProps {
	sortAttribute: string;
	sortOrder: 'asc' | 'desc';
	sortOptions: SortOption[];
	onSortAttributeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	onSortOrderChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SortHelper(props: SortComponentProps) {
	return (
		<div>
			<label htmlFor="sortAttribute">Sort by:</label>
			<select id="sortAttribute" value={props.sortAttribute} onChange={props.onSortAttributeChange}>
				{props.sortOptions.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			<label htmlFor="sortOrder">Order:</label>
			<select id="sortOrder" value={props.sortOrder} onChange={props.onSortOrderChange}>
				<option value="asc">Ascending</option>
				<option value="desc">Descending</option>
			</select>
		</div>
	);
}
