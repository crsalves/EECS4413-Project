export const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions;

const DEFAULT_LOCALE = { code: 'en-US', currency: 'USD' };

function processInput(inputValue: InputNumberValue): number | null {
	if (inputValue == null || Number.isNaN(inputValue)) return null;
	return Number(inputValue);
}
export function fCurrency(inputValue: InputNumberValue, options?: Options) {
	const locale = DEFAULT_LOCALE;

	const number = processInput(inputValue);
	if (number === null) return '';

	const fm = new Intl.NumberFormat(locale.code, {
		style: 'currency',
		currency: locale.currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		...options
	}).format(number);

	return fm;
}