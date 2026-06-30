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

    if (session?.user?.role !== 'admin') {
        return <UnauthorizedPage />;
    }

    return <div>{children}</div>;
};

export default Layout;