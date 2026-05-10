import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [formData, setFormData] = useState({
        StudentID: '',
        ComplaintText: '',
        Status: 'Pending'
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                toast.success('Complaint deleted successfully');
                fetchComplaints();
            } catch (error) {
                toast.error('Failed to delete complaint');
            }
        }
    };

    const openAddModal = () => {
        setEditingComplaint(null);
        setFormData({ StudentID: '', ComplaintText: '', Status: 'Pending' });
        setIsModalOpen(true);
    };

    const openEditModal = (complaint) => {
        setEditingComplaint(complaint);
        setFormData({
            StudentID: complaint.StudentID || '',
            ComplaintText: complaint.ComplaintText || '',
            Status: complaint.Status || 'Pending'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingComplaint) {
                await api.put(`/complaints/${editingComplaint.ComplaintID}`, formData);
                toast.success('Complaint updated successfully');
            } else {
                await api.post('/complaints', formData);
                toast.success('Complaint added successfully');
            }
            setIsModalOpen(false);
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save complaint');
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.put(`/complaints/${id}`, { Status: newStatus });
            toast.success(`Complaint marked as ${newStatus}`);
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to update complaint');
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Resolved': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={12} className="mr-1" /> Resolved</span>;
            case 'In Progress': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock size={12} className="mr-1" /> In Progress</span>;
            default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>New Complaint</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
                ) : complaints.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No complaints found.</div>
                ) : (
                    complaints.map((complaint) => (
                        <div key={complaint.ComplaintID} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{complaint.FullName}</span>
                                        <span className="text-xs text-gray-500">Room {complaint.RoomNumber || 'N/A'} • {new Date(complaint.Date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(complaint.Status)}
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(complaint)} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(complaint.ComplaintID)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm mb-6">{complaint.ComplaintText}</p>
                            </div>
                            
                            {complaint.Status !== 'Resolved' && (
                                <div className="flex gap-2 mt-auto border-t border-gray-100 pt-4">
                                    {complaint.Status === 'Pending' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(complaint.ComplaintID, 'In Progress')}
                                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 rounded-lg transition-colors"
                                        >
                                            Mark In Progress
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleUpdateStatus(complaint.ComplaintID, 'Resolved')}
                                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium py-2 rounded-lg transition-colors"
                                    >
                                        Mark Resolved
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingComplaint ? "Edit Complaint" : "New Complaint"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                        <input 
                            required type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.StudentID} onChange={(e) => setFormData({...formData, StudentID: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select 
                            required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={formData.Status} onChange={(e) => setFormData({...formData, Status: e.target.value})}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Description *</label>
                        <textarea 
                            required rows="4" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.ComplaintText} onChange={(e) => setFormData({...formData, ComplaintText: e.target.value})}
                        ></textarea>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                        <button 
                            type="button" onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            {editingComplaint ? "Save Changes" : "Submit Complaint"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Complaints;
