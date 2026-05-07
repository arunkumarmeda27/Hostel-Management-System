import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Topbar = () => {
    const navigate = useNavigate();
    const adminStr = localStorage.getItem('admin');
    const admin = adminStr ? JSON.parse(adminStr) : { username: 'Admin' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <div className="text-xl font-semibold text-gray-800">
                {/* Could map location to title here */}
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium">{admin.username}</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Topbar;
