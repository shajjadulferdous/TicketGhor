import UnauthorizedPage from '@/app/error';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const Layout = async ({ children }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    if (session?.user?.role !== 'user') {
        return <UnauthorizedPage />;
    }

    return <>{children}</>;
};

export default Layout;