import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import type { Navigation } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import styles from './AdminRootPage.module.css';

export default function AdminRootPage() {
	const NAVIGATION: Navigation = [
		{
			kind: 'header',
			title: 'Main items'
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
		},
		{
			segment: 'admin/orders',
			title: 'Sales',
			icon: <ReceiptIcon />
		}
	];

	const BRANDING = {
		title: 'Cyber Pet Admin Page',
		homeUrl: '/admin'
	};

	return (
		<div className={styles.adminContainer}>
			<ProtectedRoute>
				<AppProvider navigation={NAVIGATION} branding={BRANDING}>
					<DashboardLayout>
						<PageContainer title="">
							<Outlet />
						</PageContainer>
					</DashboardLayout>
				</AppProvider>
			</ProtectedRoute>
		</div>
	);
}
