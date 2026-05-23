import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, CreditCard, MessageSquare, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { role } = useAuth();

    const adminMenuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Students', icon: Users, path: '/students' },
        { name: 'Rooms', icon: Home, path: '/rooms' },
        { name: 'Fees', icon: CreditCard, path: '/fees' },
        { name: 'Complaints', icon: MessageSquare, path: '/complaints' },
        { name: 'Mess', icon: Utensils, path: '/mess' },
        { name: 'Announcements', icon: MessageSquare, path: '/announcements' },
    ];

    const studentMenuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Fees', icon: CreditCard, path: '/fees' },
        { name: 'Mess', icon: Utensils, path: '/mess' },
        { name: 'Complaints', icon: MessageSquare, path: '/complaints' },
        { name: 'Announcements', icon: MessageSquare, path: '/announcements' },
    ];

    const menuItems = role === 'admin' ? adminMenuItems : studentMenuItems;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen hidden md:flex flex-col shadow-sm">
            <div className="py-5 px-6 border-b border-gray-100 bg-white flex flex-col gap-3">
                <div className="w-full h-12 flex items-center justify-start overflow-hidden">
                    <img src="/logo.png" alt="DSCE" className="w-full h-full object-contain object-left" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 leading-tight">Dayananda Sagar</span>
                    <span className="text-xs font-semibold text-blue-600">Institutions Hostel</span>
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive 
                                ? 'bg-blue-50 text-blue-700 font-medium' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
