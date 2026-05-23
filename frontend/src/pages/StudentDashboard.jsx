import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Home, MessageSquare, Megaphone, Clock, CreditCard, Utensils, Users, Plus, Send, Phone, Mail, MapPin, PhoneCall } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [feeStatus, setFeeStatus] = useState(null);
    const [lastPaidFee, setLastPaidFee] = useState(null);
    const [messPlan, setMessPlan] = useState(null);
    const [roommates, setRoommates] = useState([]);
    
    // Complaint form state
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaintText, setComplaintText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    let user = {};
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined' && userStr !== null) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        user = {};
    }

    useEffect(() => {
        if (user.id) {
            fetchDashboardData();
        }
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Get student profile
            const { data: profile } = await api.get(`/students/${user.id}`);
            setStudentInfo(profile);

            // Get roommates
            const { data: mates } = await api.get(`/students/${user.id}/roommates`);
            setRoommates(mates);

            // Get announcements
            const { data: announcements } = await api.get('/announcements');
            setRecentAnnouncements(announcements.slice(0, 3));

            // Get complaints
            const { data: complaints } = await api.get('/complaints');
            setRecentComplaints(complaints.slice(0, 3));

            // Get recent fee
            const { data: fees } = await api.get('/fees');
            if (fees.length > 0) {
                setFeeStatus(fees[0]);
                setLastPaidFee(fees.find(f => f.PaymentStatus === 'Paid'));
            }

            // Get mess plan
            const { data: mess } = await api.get('/mess');
            if (mess.length > 0) setMessPlan(mess[0]);

        } catch (error) {
            toast.error('Failed to load dashboard data');
        }
    };

    const handleRaiseComplaint = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;
        
        setIsSubmitting(true);
        try {
            await api.post('/complaints', {
                StudentID: user.id,
                ComplaintText: complaintText
            });
            toast.success('Complaint raised successfully');
            setComplaintText('');
            setShowComplaintForm(false);
            
            // Refresh complaints
            const { data: complaints } = await api.get('/complaints');
            setRecentComplaints(complaints.slice(0, 3));
        } catch (error) {
            toast.error('Failed to raise complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!studentInfo) return <div className="flex items-center justify-center h-full">Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {studentInfo.FullName}!</h1>
                <p className="text-blue-100 opacity-90">DSCE Hostel Management System - Student Portal</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                            <Home size={20} className="text-blue-200" />
                            <span className="text-sm font-medium text-blue-100">Room Details</span>
                        </div>
                        <p className="text-xl font-bold">{studentInfo.RoomNumber ? `Room ${studentInfo.RoomNumber}` : 'Not Assigned'}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                            <Users size={20} className="text-blue-200" />
                            <span className="text-sm font-medium text-blue-100">Roommates</span>
                        </div>
                        <p className="text-xl font-bold">{roommates.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                            <User size={20} className="text-blue-200" />
                            <span className="text-sm font-medium text-blue-100">Department</span>
                        </div>
                        <p className="text-xl font-bold">{studentInfo.Department}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock size={20} className="text-blue-200" />
                            <span className="text-sm font-medium text-blue-100">Year</span>
                        </div>
                        <p className="text-xl font-bold">{studentInfo.Year}{studentInfo.Year === 1 ? 'st' : studentInfo.Year === 2 ? 'nd' : studentInfo.Year === 3 ? 'rd' : 'th'} Year</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Current Fee Status</p>
                            <p className={`text-lg font-bold ${feeStatus?.PaymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {feeStatus ? feeStatus.PaymentStatus : 'No Records'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Last Fee Paid</p>
                        {lastPaidFee ? (
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-900">₹{lastPaidFee.Amount}</span>
                                <span className="text-gray-500">{new Date(lastPaidFee.DueDate).toLocaleDateString()}</span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No payment history.</p>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <Utensils size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Mess Plan</p>
                        <p className="text-lg font-bold text-gray-900">
                            {messPlan ? messPlan.PlanType : 'Not Assigned'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile & Roommates Detailed Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <User size={24} className="text-blue-600" /> My Profile Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Mail size={18} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Email Address</p>
                                <p className="text-sm text-gray-500">{studentInfo.Email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone size={18} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Phone Number</p>
                                <p className="text-sm text-gray-500">{studentInfo.PhoneNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <PhoneCall size={18} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Parent Contact</p>
                                <p className="text-sm text-gray-500">{studentInfo.ParentContact}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Home Address</p>
                                <p className="text-sm text-gray-500">{studentInfo.Address || 'No address provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <Users size={24} className="text-blue-600" /> My Roommates
                    </h3>
                    {roommates.length > 0 ? (
                        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                            {roommates.map((mate) => (
                                <div key={mate.StudentID} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-gray-900">{mate.FullName}</span>
                                        <span className="text-gray-500 text-xs bg-white px-2 py-1 rounded border border-gray-200">{mate.Department} ({mate.Year} Yr)</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                                        <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400"/> {mate.PhoneNumber || 'N/A'}</span>
                                        <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400"/> {mate.Email || 'N/A'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[150px] text-gray-400">
                            <Users size={32} className="mb-2 opacity-50" />
                            <p className="italic">No roommates assigned.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Announcements Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Megaphone size={24} className="text-blue-600" />
                            Recent Updates
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recentAnnouncements.map((ann) => (
                            <div key={ann.AnnouncementID} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h3 className="font-semibold text-gray-900">{ann.Title}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ann.Content}</p>
                                <span className="text-xs text-blue-600 font-medium mt-2 block">
                                    {new Date(ann.CreatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {recentAnnouncements.length === 0 && <p className="text-gray-500 italic">No recent updates.</p>}
                    </div>
                </div>

                {/* Complaints Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare size={24} className="text-blue-600" />
                            My Complaints
                        </h2>
                        <button 
                            onClick={() => setShowComplaintForm(!showComplaintForm)}
                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-1 transition-colors"
                        >
                            <Plus size={16} /> New
                        </button>
                    </div>

                    {showComplaintForm && (
                        <form onSubmit={handleRaiseComplaint} className="mb-6 bg-gray-50 p-4 rounded-xl border border-blue-100">
                            <textarea
                                required
                                rows="3"
                                placeholder="Describe your issue..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-3"
                                value={complaintText}
                                onChange={(e) => setComplaintText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowComplaintForm(false)}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors disabled:opacity-70"
                                >
                                    <Send size={14} /> Submit
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {recentComplaints.map((comp) => (
                            <div key={comp.ComplaintID} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1 mr-4">
                                    <p className="text-sm text-gray-900 font-medium line-clamp-1">{comp.ComplaintText}</p>
                                    <span className="text-xs text-gray-500">
                                        {new Date(comp.Date).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                    comp.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    comp.Status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {comp.Status}
                                </span>
                            </div>
                        ))}
                        {recentComplaints.length === 0 && !showComplaintForm && (
                            <p className="text-gray-500 italic text-center py-4">No complaints raised yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
