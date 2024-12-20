import React, { useState, useEffect } from 'react';


export interface User {
	userId: number;
	name: string;
	email: string;

	phone?: string;

	role?: 'customer' | 'admin';
}

export interface UserAddress {
	userAddressId: number;
	userId: number;
	street: string;
	complement: string;
	city: string;
	province: string;
	country: string;
	postalCode: string;
	isDefault: boolean;
}

export interface UserPayment {
	userPaymentId: number;
	userId: number;
	cardNumber: string;
	cvv: string;
	cardType: string;
	expiryDate: string;
	cardIssuerName: string;
	isDefault: boolean;
}

const AuthenticationContext = React.createContext({
	isLoggedInContext: false,
	user: {} as User,
	userAddress: null as UserAddress[] | null,
	userPayment: null as UserPayment[] | null,
	onLogin: (token: string, user: User, userAddress: UserAddress[] | null, userPayment: UserPayment[] | null) => {},
	onLogout: () => {},
	setUserState: (user: User) => {},
	setUserAddressState: (userAddress: UserAddress[] | null) => {},
	setUserPaymenState: (userPayment: UserPayment[] | null) => {},
	isUserLogged: () => {}
});

export default AuthenticationContext;

export const AuthenticationContextProvider = (props) => {
	const token = localStorage.getItem('token');

	const [isLogged, setLoggedIn] = useState(token !== undefined && token !== null ? true : false); // TODO - check if the token is valid

	const [user, setUser] = useState<User>({} as User);
	const [userAddress, setUserAddress] = useState<UserAddress[] | null>(null);
	const [userPayment, setUserPayment] = useState<UserPayment[] | null>(null);

	function handleLogin(
		token: string,
		user: User,
		userAddress: UserAddress[] | null,
		userPayment: UserPayment[] | null
	) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('userAddress', JSON.stringify(userAddress));
		localStorage.setItem('userPayment', JSON.stringify(userPayment));
		const expiration = new Date();

		expiration.setMinutes(expiration.getMinutes() + 60);
		localStorage.setItem('expiration', expiration.toISOString());
		setUser(user);
		setUserAddress(userAddress);
		setUserPayment(userPayment);
		setLoggedIn(true);

		const tokenDuration = expiration.getTime() - new Date().getTime();

		console.log('RootPage token duration', tokenDuration);

		setTimeout(() => {
			console.log('RootPage token expired');
			handleLogout();
		}, tokenDuration);
	}

	function handleLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('expiration');
		localStorage.removeItem('user');
		localStorage.removeItem('userAddress');
		localStorage.removeItem('userPayment');
		setUser({} as User);
		setUserAddress(null);
		setUserPayment(null);
		setLoggedIn(false);
	}

	function isUserLogged() {
		if (localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null) {
			const storedExpirationDate = localStorage.getItem('expiration');
			const now = new Date();
			const expirationDate = storedExpirationDate ? new Date(storedExpirationDate) : now;

			const duration = expirationDate.getTime() - now.getTime();

			if (duration > 0) {
				setLoggedIn(true);
			} else {
				handleLogout();
			}
		} else {
			handleLogout();
		}
	}

	function setUserState(user: User) {
		setUser(user);
	}
	function setUserAddressState(userAddress: UserAddress[] | null) {
		setUserAddress(userAddress);
	}

	function setUserPaymenState(userPayment: UserPayment[] | null) {
		setUserPayment(userPayment);
	}

	/** every time I render this auth-store, this function (piece of code "useEffect()") executes. **/
	useEffect(() => {
		console.log('I am on the useEffect at the Authetication Provider');

		if (
			localStorage.getItem('token') !== undefined &&
			localStorage.getItem('token') !== null &&
			localStorage.getItem('user') !== undefined &&
			localStorage.getItem('user') !== null
		) {
			const storedExpirationDate = localStorage.getItem('expiration');
			const now = new Date();
			const expirationDate = storedExpirationDate ? new Date(storedExpirationDate) : now;

			const duration = expirationDate.getTime() - now.getTime();

			console.log('Checking if the user is logged in:', duration);

			if (duration > 0) {
				const user = JSON.parse(localStorage.getItem('user') as string);
				const userAddress = JSON.parse(localStorage.getItem('userAddress') as string);
				const userPayment = JSON.parse(localStorage.getItem('userPayment') as string);
				setUser(user);
				setUserAddress(userAddress);
				setUserPayment(userPayment);
				setLoggedIn(true);
			} else {
				handleLogout();
			}
		} else {
			handleLogout();
		}
	}, []); // empty "[]" means it has no dependencies attached to this useEffect() function

	console.log({
		isLoggedInContext: isLogged,
		user: user || ({} as User),
		userAddress: userAddress || ({} as UserAddress),
		userPayment: userPayment || ({} as UserPayment),
		onLogin: handleLogin,
		onLogout: handleLogout,
		isUserLogged: isUserLogged
	});

	return (
		<AuthenticationContext.Provider
			value={{
				isLoggedInContext: isLogged,
				user: user,
				userAddress: userAddress,
				userPayment: userPayment,
				onLogin: handleLogin,
				onLogout: handleLogout,
				isUserLogged: isUserLogged,
				setUserState: setUserState,
				setUserAddressState: setUserAddressState,
				setUserPaymenState: setUserPaymenState
			}}
		>
			{props.children}
		</AuthenticationContext.Provider>
	);
};
