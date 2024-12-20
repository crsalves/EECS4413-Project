import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CartPage from './pages/Cart/CartPage';
import ProductDetailViewPage from './pages/Product/ProductDetailViewPage';
import { LOADER_PRODUCT_ID, getProductIdLoader } from './pages/Product/getProductIdLoader';
import CatalogMainPage from './pages/Catalog/CatalogPage';
import { getCatalogLoader } from './pages/Catalog/getCatalogLoader';
// import CheckoutMainPage from './pages/Checkout/CheckoutMainPage';
import { HomePage } from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import { validateLoginAction } from './pages/Login/validateLoginAction';
// import OrderMainPage from './pages/Order/OrderPage';
import ProfileAccountPage from './pages/Profile/ProfileAccountPage';
import ProfileAddressPage from './pages/Profile/ProfileAddressPage';
import ProfilePaymentPage from './pages/Profile/ProfilePaymentPage';
import { getProfilePaymentLoader } from './pages/Profile/getProfilePaymentLoader';
import ProfilePage from './pages/Profile/ProfilePage';
import { getProfileLoader } from './pages/Profile/getProfileLoader';
//  import CategoryPage from './pages/Category/CategoryPage';
import { getProductByCategoryLoader, LOADER_PRODUCT_BY_CATEGORY } from './pages/Category/getProductByCategoryLoader';
import { getHomePageLoader } from './pages/Home/getHomePageLoader';
import { RootPage } from './pages/Root/RootPage';

import AdminOrdersPage from './pages/Admin/AdminOrdersPage';
import AdminProductsPage from './pages/Admin/AdminProductsPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminRootPage from './pages/Admin/AdminRootPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import { productSearchLoader, LOADER_PRODUCT_SEARCH } from './pages/Product/productSearchLoader';
import OrderViewPage from './pages/Order/OrderViewPage';
import { getOrderLoader } from './pages/Order/getOrderLoader';
import RegistrationPage from './pages/Registration/RegistrationPage';
import { addRegistrationAction } from './pages/Registration/addRegistrationAction';
import CheckoutRootPage from './pages/Checkout/CheckoutRootPage';
import OrderByUserPage from './pages/Order/OrderByUserPage';
import { getOrderByUserLoader } from './pages/Order/getOrderByUserLoader';
import { getOrdersLoader } from './pages/Order/getOrdersLoader';
import { getProfileAddressLoader } from './pages/Profile/getProfileAddressLoader';
import { LOADER_CATEGORY_DATA } from './pages/Catalog/getCatalogLoader';

import { API_URL } from './config/config';

// Set the API URL in the window object
window.config = {
	apiUrl: API_URL
};

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
