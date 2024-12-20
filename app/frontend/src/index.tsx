/**
 * Entry point of the application that renders the App component in the root element.
 *
 * @file index.tsx
 * @author Carla da Silva Alves
 */


import ReactDOM from 'react-dom/client';

import { AuthenticationContextProvider } from './store/AuthenticationContext';
import { CartContextProvider } from './store/CartContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './themes/theme';
import App from './App';
import './index.module.css';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<AuthenticationContextProvider>
			<CartContextProvider>
				<App />
			</CartContextProvider>
		</AuthenticationContextProvider>
	</ThemeProvider>
);

