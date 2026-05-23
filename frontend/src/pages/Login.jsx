import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Home, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // 'admin' or 'student'
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const endpoint = role === 'admin' ? '/auth/login' : '/auth/student/login';
            const { data } = await api.post(endpoint, { username, password });
            login(data.token, data.user);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <div className="w-full max-w-[280px] h-20 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 overflow-hidden p-2">
                        <img src="/logo.png" alt="DSCE Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                        Dayananda Sagar Institutions Hostel
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Sign in to manage the hostel
                    </p>
                </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Student
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
