import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, CreditCard, MessageSquare, Utensils } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Students', icon: Users, path: '/students' },
        { name: 'Rooms', icon: Home, path: '/rooms' },
        { name: 'Fees', icon: CreditCard, path: '/fees' },
        { name: 'Complaints', icon: MessageSquare, path: '/complaints' },
        { name: 'Mess', icon: Utensils, path: '/mess' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen hidden md:flex flex-col shadow-sm">
            <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 bg-white">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-indigo-50">
                    <img src="/logo.png" alt="DSCE" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 leading-tight">Dayananda Sagar</span>
                    <span className="text-xs font-semibold text-indigo-600">Institutions Hostel</span>
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
                                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
