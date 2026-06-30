import UnauthorizedPage from '@/app/error';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

const Layout = async ({ children }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }


    return <>{children}</>;
};

export default Layout;