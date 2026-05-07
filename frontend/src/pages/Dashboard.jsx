import { useState, useEffect } from 'react';
import { Users, Home, AlertCircle, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/dashboard/stats');
            setStats(data.stats);
            setCharts(data.charts);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

    const statCards = [
        { title: 'Total Students', value: stats?.totalStudents, icon: Users, color: 'bg-blue-500' },
        { title: 'Available Rooms', value: stats?.availableRooms, icon: Home, color: 'bg-emerald-500' },
        { title: 'Pending Complaints', value: stats?.pendingComplaints, icon: AlertCircle, color: 'bg-amber-500' },
        { title: 'Pending Fees', value: stats?.pendingFeesCount, icon: IndianRupee, color: 'bg-rose-500' },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1">
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Fee Collection (Monthly)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="99%" height="100%" minHeight={1}>
                            <BarChart data={charts?.feeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Room Occupancy by Type</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="99%" height="100%" minHeight={1}>
                            <PieChart>
                                <Pie
                                    data={charts?.occupancyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {charts?.occupancyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {charts?.occupancyData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-sm text-gray-600">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
