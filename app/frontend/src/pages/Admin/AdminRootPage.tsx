import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { AppProvider } from '@toolpad/core/react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import type { Navigation } from '@toolpad/core';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

export default function AdminRootPage() {
	const NAVIGATION: Navigation = [
		{
			kind: 'header',
			title: 'Main items'
		},
		{
			segment: 'admin/dashboard',
			title: 'Dashboard',
			icon: <DashboardIcon />
		},
		{
			segment: 'admin/orders',
			title: 'Sales',
			icon: <ReceiptIcon />
		},
		{
			segment: 'admin/products',
			title: 'Inventory',
			icon: <InventoryIcon />
		},
		{
			segment: 'admin/users',
			title: 'Users',
			icon: <PersonIcon />
		}
	];

	const BRANDING = {
		title: 'Cyber Pet Admin Page',
		homeUrl: '/admin'
	};

	return (
		<ProtectedRoute>
			<AppProvider navigation={NAVIGATION} branding={BRANDING}>
				<DashboardLayout>
					<PageContainer title="">
						<Outlet />
					</PageContainer>
				</DashboardLayout>
			</AppProvider>
		</ProtectedRoute>
	);
}
