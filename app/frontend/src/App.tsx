import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminOrdersPage from './pages/Admin/AdminOrdersPage';
import AdminProductsPage from './pages/Admin/AdminProductsPage';
import AdminRootPage from './pages/Admin/AdminRootPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import CartPage from './pages/Cart/CartPage';
import CatalogMainPage from './pages/Catalog/CatalogPage';
import { LOADER_CATEGORY_DATA, getCatalogLoader } from './pages/Catalog/getCatalogLoader';
import { LOADER_PRODUCT_BY_CATEGORY, getProductByCategoryLoader } from './pages/Category/getProductByCategoryLoader';
import CheckoutRootPage from './pages/Checkout/CheckoutRootPage';
import { HomePage } from './pages/Home/HomePage';
import { getHomePageLoader } from './pages/Home/getHomePageLoader';
import LoginPage from './pages/Login/LoginPage';
import { validateLoginAction } from './pages/Login/validateLoginAction';
import OrderByUserPage from './pages/Order/OrderByUserPage';
import OrderViewPage from './pages/Order/OrderViewPage';
import { getOrderByUserLoader } from './pages/Order/getOrderByUserLoader';
import { getOrderLoader } from './pages/Order/getOrderLoader';
import { getOrdersLoader } from './pages/Order/getOrdersLoader';
import ProductDetailViewPage from './pages/Product/ProductDetailViewPage';
import { LOADER_PRODUCT_ID, getProductIdLoader } from './pages/Product/getProductIdLoader';
import { LOADER_PRODUCT_SEARCH, productSearchLoader } from './pages/Product/productSearchLoader';
import ProfileAccountPage from './pages/Profile/ProfileAccountPage';
import ProfileAddressPage from './pages/Profile/ProfileAddressPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProfilePaymentPage from './pages/Profile/ProfilePaymentPage';
import { getProfileAddressLoader } from './pages/Profile/getProfileAddressLoader';
import { getProfileLoader } from './pages/Profile/getProfileLoader';
import { getProfilePaymentLoader } from './pages/Profile/getProfilePaymentLoader';
import RegistrationPage from './pages/Registration/RegistrationPage';
import { addRegistrationAction } from './pages/Registration/addRegistrationAction';
import { RootPage } from './pages/Root/RootPage';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <RootPage />,
			children: [
				{ index: true, element: <HomePage />, loader: getHomePageLoader },
				{
					path: 'catalog',
					children: [
						{
							index: true,
							element: <CatalogMainPage />,
							loader: getCatalogLoader,
							id: LOADER_CATEGORY_DATA
						},
						{
							path: 'product/:productId',
							id: LOADER_PRODUCT_ID,
							loader: getProductIdLoader,
							children: [{ index: true, element: <ProductDetailViewPage /> }]
						},
						{
							path: 'product/search/:query',
							id: LOADER_PRODUCT_SEARCH,
							loader: productSearchLoader,
							element: <CatalogMainPage />
						},
						{
							path: 'category/:categoryId',
							id: LOADER_PRODUCT_BY_CATEGORY,
							loader: getProductByCategoryLoader,
							element: <CatalogMainPage />
						}
					]
				},
				{
					path: 'cart',
					element: <CartPage />
				},
				{
					path: 'checkout',
					children: [{ index: true }, { path: 'root', element: <CheckoutRootPage /> }]
				},
				{
					path: 'order',
					children: [
						{ path: 'view/:orderId', element: <OrderViewPage />, loader: getOrderLoader },
						{ path: 'user/:userId', element: <OrderByUserPage />, loader: getOrderByUserLoader }
					]
				},
				{ path: 'login', element: <LoginPage />, action: validateLoginAction },
				{ path: 'registration', element: <RegistrationPage />, action: addRegistrationAction },
				{
					path: 'user',
					children: [
						{ index: true },
						{
							path: ':userId',
							children: [
								{ index: true, element: <ProfilePage /> },
								{ path: 'account', element: <ProfileAccountPage />, loader: getProfileLoader },
								{
									path: 'address',
									element: <ProfileAddressPage />,
									loader: getProfileAddressLoader
								},
								{
									path: 'billing',
									element: <ProfilePaymentPage />,
									loader: getProfilePaymentLoader
								}
							]
						}
					]
				},
				{
					path: 'admin',
					element: <AdminRootPage />,
					children: [
						{
							path: 'dashboard',
							element: <AdminDashboardPage />
						},
						{
							path: 'orders',
							element: <AdminOrdersPage />,
							loader: getOrdersLoader
						},
						{
							path: 'products',
							element: <AdminProductsPage />
						},
						{
							path: 'users',
							element: <AdminUsersPage />
						}
					]
				}
			]
		}
	],
	{
		future: {
			v7_relativeSplatPath: true, // Enables relative paths in nested routes
			v7_fetcherPersist: true, // Retains fetcher state during navigation
			v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
			v7_partialHydration: true, // Supports partial hydration for server-side rendering
			v7_skipActionErrorRevalidation: true // Prevents revalidation when action errors occur
		}
	}
);

export default function App() {
	return <RouterProvider router={router} />;
}
