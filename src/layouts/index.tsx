import { Outlet } from '@umijs/max';
import UserLayout from './UserLayout';

export { UserLayout };

// This is a placeholder for the default layout
// Umi4 will use the layout configuration from .umirc.ts
// export default ({ children }: { children: React.ReactNode }) => children; // 这行错误

const AdminLayout: React.FC = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export default AdminLayout;
