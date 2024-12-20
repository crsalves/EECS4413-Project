import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import CartContext from 'src/store/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Badge from '@mui/material/Badge';

import AuthenticationContext from 'src/store/AuthenticationContext';
import { useContext } from 'react';

export default function HeaderBar() {
	// const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
	const cartContext = useContext(CartContext);
	const userContext = useContext(AuthenticationContext);

	const totalCartItems = cartContext.items.reduce((totalNumberOfItems, item) => {
		return totalNumberOfItems + item.quantity;
	}, 0);

	const pages = [
		{ title: 'Home', path: '/' },
		{ title: 'Shop', path: '/catalog' }
	];

	let settings: any[] = [];

	if (userContext.isLoggedInContext) {
		settings = [
			{ title: 'Your Account', path: '/user/' + userContext.user.userId },
			{ title: 'Your Orders', path: '/order/user/' + userContext.user.userId },
			{ title: 'Logout', path: '/logout' }
		];
		if (userContext.user.role === 'admin') {
			pages.push({ title: 'Admin', path: '/admin' });
		}
	} else {
		settings = [{ title: 'Login', path: '/login' }];
	}

	const navigate = useNavigate();

	const handleClickNavMenu = (path: string) => {
		navigate(path);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleClickUserMenu = (path: string) => {
		setAnchorElUser(null);
		if (path === '/logout') {
			userContext.onLogout();
			navigate('/');
		} else {
			localStorage.setItem('previousPath', window.location.pathname);
			navigate(path);
		}
	};

	return (
		<AppBar position="fixed">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>

					<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none'
						}}
					>
						Cyber Pets
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page.title}
								onClick={() => {
									handleClickNavMenu(page.path);
								}}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								{page.title}
							</Button>
						))}
					</Box>

					<IconButton
						size="large"
						aria-label="cart-shop"
						onClick={() => {
							navigate('/cart');
						}}
						color="inherit"
					>
						<Badge badgeContent={totalCartItems} color="error">
							<ShoppingCartIcon />
						</Badge>
					</IconButton>
					<Box sx={{ flexGrow: 0 }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenUserMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right'
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right'
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem
									key={setting.title}
									onClick={() => {
										handleClickUserMenu(setting.path);
									}}
								>
									<Typography sx={{ textAlign: 'center' }}>{setting.title}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
