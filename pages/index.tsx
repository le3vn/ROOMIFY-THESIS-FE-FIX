import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'; // Import useSession
import { Page } from '../types/Page';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '@/components/Title';

const IndexPage: Page = () => {
    const router = useRouter();
    const { data: session, status } = useSession(); // Get the session

    useEffect(() => {
        if (status === 'loading') return; // Wait for the session to load

        // Check if user is not authenticated, redirect to /login
        if (!session) {
            router.push('/login');
            return;
        }

        // If user is authenticated but has a specific role, redirect to /dashboardUser
        const userRole = session?.user?.role?.[0];
        if (userRole && ['Student', 'Lecturer', 'StudentOrganization', 'Staff'].includes(userRole)) {
            router.push('/dashboardUser');
        }
        else if (userRole && ['SuperAdmin'].includes(userRole)){
            router.push('/dashboardAdmin');
        }
        else {
            router.push('/dashboardApprover');
        }

    }, [session, status, router]); // Include session and status as dependencies

    return (
        <div className="w-full">
            <Title>Home</Title>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
