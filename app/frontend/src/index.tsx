/**
 * Entry point of the application that renders the App component in the root element.
 *
 * @file index.tsx
 * @author Carla da Silva Alves
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthenticationContextProvider } from './store/AuthenticationContext';
import { CartContextProvider } from './store/CartContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './themes/theme';

import './index.module.css';

console.log('API UR at windonconfigL:', window.config.apiUrl);

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthenticationContextProvider>
				<CartContextProvider>
					<App />
				</CartContextProvider>
			</AuthenticationContextProvider>
		</ThemeProvider>
	</React.StrictMode>
);

