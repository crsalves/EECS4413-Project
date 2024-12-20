import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox
} from '@mui/material';

const ReusableModal = ({ open, title, fields, data, onChange, onClose, onSubmit, loading = false }) => {
	const renderField = (field) => {
		const { name, label, type, options } = field;

		switch (type) {
			case 'select':
				return (
					<Select
						key={name}
						label={label}
						name={name}
						value={data[name] || ''}
						onChange={onChange}
						fullWidth
						margin="dense"
						displayEmpty
					>
						{options.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>
				);
			case 'checkbox':
				return (
					<FormControlLabel
						key={name}
						control={<Checkbox name={name} checked={data[name] || false} onChange={onChange} />}
						label={label}
					/>
				);
			default:
				return (
					<TextField
						key={name}
						label={label}
						name={name}
						type={type || 'text'}
						value={data[name] || ''}
						onChange={onChange}
						fullWidth
						margin="normal"
					/>
				);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{fields.map((field) => renderField(field))}</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={onSubmit} color="primary">
					{loading ? 'Submtting...' : 'Submit'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ReusableModal;
