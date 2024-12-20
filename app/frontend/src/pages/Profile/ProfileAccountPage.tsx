import ProfileContactSectionPage from './ProfileContactSectionPage';
import ProfilePasswordSectionPage from './ProfilePasswordSectionPage';
import { useLoaderData } from 'react-router-dom';

export interface User {
	userId: number;
	name: string;
	email: string;
	passwordHash: string;
	phone?: string;
	addressStreet?: string;
	addressComplement?: string;
	addressProvince?: string;
	addressCountry?: string;
	addressPostalCode?: string;
	role?: 'customer' | 'admin';
	createdAt?: Date;
	updatedAt?: Date;
}

export default function ProfileAccountPage() {
	const loaderData = useLoaderData() as {
		message: string;
		data: User;
	};
	const userData = loaderData.data;

	return (
		<div style={{ padding: '20px' }}>
			<ProfileContactSectionPage userData={userData} />
			<ProfilePasswordSectionPage userData={userData} />
		</div>
	);
}
