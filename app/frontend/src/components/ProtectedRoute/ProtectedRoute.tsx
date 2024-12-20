import { useContext } from 'react';
import AutContext from '../../store/AuthenticationContext';
import { useLocation, Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
	const ctx = useContext(AutContext);

	const location = useLocation();

	if (ctx.isLoggedInContext === false) {
		console.log('ProtectedRoute says that user is not logged in');
		// Note! using the useNavigate here, the user will be redirected to the login page, then
		// after login, the user will be redirected to the transaction list page, but if we use
		// the useLocation here, the user will be redirected to the login page, then after login,
		// the user will be redirected to page where the user was before the login page.

		return <Navigate to="/" replace state={{ from: location }} />;
	} else {
		console.log('ProtectedRoute says that user is logged in');
		return children;
	}
}

export default ProtectedRoute;
