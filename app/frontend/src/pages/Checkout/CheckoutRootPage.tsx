import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckoutSummaryPage from './CheckoutSummaryPage';
import CheckoutReviewPage from './CheckoutReviewPage';
import CheckoutPaymentPage from './CheckoutPaymentPage';
import CheckoutAddressPage from './CheckoutAddressPage';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthenticationContext from 'src/store/AuthenticationContext';

const steps = ['Cart Summary', 'Address', 'Payment', 'Checkout Review'];

export default function CheckoutRootPage() {
	const navigate = useNavigate();
	const userContext = useContext(AuthenticationContext);

	const userPayment = userContext.userPayment;

	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());

	const defaultPayment = userPayment ? userPayment.find((card) => card.isDefault) : null;
	const defaultAddress = userContext.userAddress
		? userContext.userAddress.find((address) => address.isDefault)
		: null;

	const [orderAddressId, setOrderAddressId] = React.useState(defaultAddress);
	const [orderCardId, setOrderCardId] = React.useState(defaultPayment?.userPaymentId);

	const isStepOptional = (step: number) => {
		return step === -1;
	};

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		if (activeStep === 0) {
			navigate('/catalog');
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		}
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};
	const handleSelectAddress = (addressId) => {
		console.log('Selected Address:', addressId);
		setOrderAddressId(addressId);
		handleNext();
	};

	const handleSelectCard = (cardId) => {
		setOrderCardId(cardId);
		handleNext();
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: React.ReactNode;
					} = {};
					if (isStepOptional(index)) {
						labelProps.optional = <Typography variant="caption">Optional</Typography>;
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{activeStep === 0 && <CheckoutSummaryPage />}
			{activeStep === 1 && <CheckoutAddressPage onSelectAddress={handleSelectAddress} />}
			{activeStep === 2 && <CheckoutPaymentPage handleSelectCard={handleSelectCard} />}
			{activeStep === 3 && <CheckoutReviewPage orderAddressId={orderAddressId} orderCardId={orderCardId} />}
			{activeStep === steps.length ? (
				<React.Fragment>
					<Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={handleReset}>Reset</Button>
					</Box>
				</React.Fragment>
			) : (
				<React.Fragment>
					{/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button
							color="secondary"
							onClick={handleBack}
							sx={{ ml: 10 }}
							style={{ marginBottom: '16px' }}
							variant="contained"
						>
							{activeStep === 0 ? 'Back to Shop' : 'Back'}
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />
						{isStepOptional(activeStep) && (
							<Button
								color="primary"
								variant="contained"
								style={{ marginBottom: '16px' }}
								onClick={handleSkip}
								sx={{ mr: 10 }}
							>
								Skip
							</Button>
						)}

						{activeStep === 0 && (
							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
								disabled={activeStep === steps.length - 1 || userContext.isLoggedInContext === false}
								style={{ marginBottom: '16px' }}
								sx={{ mr: 10 }}
							>
								Next
							</Button>
						)}
					</Box>
				</React.Fragment>
			)}
		</Box>
	);
}
