import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import RegistrationContactPage from './RegistrationContactPage';
import RegistrationAddressPage from './RegistrationAddressPage';
import RegistrationPaymentPage from './RegistrationPaymentPage';
import RegistrationReviewPage from './RegistrationReviewPage';
import { useNavigate } from 'react-router-dom';

const steps = ['Contact Info', 'Address Info', 'Payment Info', 'Account Review'];

export default function RegistrationRootPage() {
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());

	const [userContact, setUserContact] = React.useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: ''
	});
	const [userAddress, setUserAddress] = React.useState({
		street: '',
		complement: '',
		city: '',
		province: '',
		postalCode: '',
		country: '',
		isDefault: 1
	});
	const [userPayment, setUserPayment] = React.useState({
		cardNumber: '',
		cardName: '',
		expiryDate: '',
		cvv: '',
		paymentTypeId: 1,
		isDefault: 1
	});

	const navigate = useNavigate();

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
	const handleAddAddress = (address, errors) => {
		if (errors.province || errors.postalCode) {
			return;
		}

		setUserAddress(address);
		handleNext();
	};

	const handleAddPayment = (card, errors) => {
		if (errors.cardNumber || errors.expiryDate || errors.cvv) {
			return;
		}
		setUserPayment(card);
		handleNext();
	};

	const handleAddContact = (contact, errors) => {
		if (errors.email || errors.phone || errors.password) {
			return;
		}
		setUserContact(contact);
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
			{activeStep === 0 && (
				<RegistrationContactPage contactData={userContact} handleAddContact={handleAddContact} />
			)}
			{activeStep === 1 && (
				<RegistrationAddressPage addressData={userAddress} handleAddAddress={handleAddAddress} />
			)}
			{activeStep === 2 && (
				<RegistrationPaymentPage paymentData={userPayment} handleAddPayment={handleAddPayment} />
			)}
			{activeStep === 3 && (
				<RegistrationReviewPage userContact={userContact} userAddress={userAddress} userPayment={userPayment} />
			)}
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
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
							{activeStep === 0 ? 'Back to Shop' : 'Back'}
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />
						{isStepOptional(activeStep) && (
							<Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
								Skip
							</Button>
						)}
					</Box>
				</React.Fragment>
			)}
		</Box>
	);
}
