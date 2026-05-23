import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const displayName = user?.fullName || user?.username || 'User';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <div className="text-xl font-semibold text-gray-800">
                {/* Could map location to title here */}
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium">{displayName}</span>
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
