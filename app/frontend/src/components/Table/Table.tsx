import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ReusableTable = ({ columns, data, onEdit, onDelete = (id: number) => {}, enableDelete = true }) => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((col) => (
							<TableCell key={col.field}>{col.header}</TableCell>
						))}
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id || row.userId || row.productid}>
							{columns.map((col) => (
								<TableCell key={`${row.id || row.userId}-${col.field}`}>{row[col.field]}</TableCell>
							))}
							<TableCell>
								<IconButton color="primary" onClick={() => onEdit(row)}>
									<Edit />
								</IconButton>
								{enableDelete && (
									<IconButton
										color="secondary"
										onClick={() => onDelete(row.id || row.userId || row.productid)}
									>
										<Delete />
									</IconButton>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ReusableTable;
