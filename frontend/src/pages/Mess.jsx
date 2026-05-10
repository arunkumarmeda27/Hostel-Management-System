import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';

const Mess = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        StudentID: '',
        PlanType: 'Veg',
        Amount: '',
        StartDate: '',
        EndDate: ''
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const { data } = await api.get('/mess');
            setPlans(data);
        } catch (error) {
            toast.error('Failed to fetch mess plans');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mess plan?')) {
            try {
                await api.delete(`/mess/${id}`);
                toast.success('Mess plan deleted successfully');
                fetchPlans();
            } catch (error) {
                toast.error('Failed to delete mess plan');
            }
        }
    };

    const openAddModal = () => {
        setEditingPlan(null);
        setFormData({ StudentID: '', PlanType: 'Veg', Amount: '', StartDate: '', EndDate: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setFormData({
            StudentID: plan.StudentID || '',
            PlanType: plan.PlanType || 'Veg',
            Amount: plan.Amount || '',
            StartDate: plan.StartDate ? new Date(plan.StartDate).toISOString().split('T')[0] : '',
            EndDate: plan.EndDate ? new Date(plan.EndDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPlan) {
                await api.put(`/mess/${editingPlan.MessID}`, formData);
                toast.success('Mess plan updated successfully');
            } else {
                await api.post('/mess', formData);
                toast.success('Mess plan added successfully');
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save mess plan');
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'Veg': return 'bg-blue-100 text-blue-800';
            case 'Non-Veg': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Mess Management</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Assign Mess Plan</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Plan ID</th>
                                <th className="px-6 py-4 font-medium">Student</th>
                                <th className="px-6 py-4 font-medium">Plan Type</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Duration</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : plans.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No mess plans found.</td></tr>
                            ) : (
                                plans.map((plan) => (
                                    <tr key={plan.MessID} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">#{plan.MessID}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{plan.FullName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(plan.PlanType)}`}>
                                                {plan.PlanType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{plan.Amount}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(plan.StartDate).toLocaleDateString()} - {new Date(plan.EndDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => openEditModal(plan)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(plan.MessID)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingPlan ? "Edit Mess Plan" : "Assign Mess Plan"}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type *</label>
                        <select 
                            required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            value={formData.PlanType} onChange={(e) => setFormData({...formData, PlanType: e.target.value})}
                        >
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                        <input 
                            required type="number" step="0.01" min="0" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.Amount} onChange={(e) => setFormData({...formData, Amount: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input 
                                required type="date" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.StartDate} onChange={(e) => setFormData({...formData, StartDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                            <input 
                                required type="date" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.EndDate} onChange={(e) => setFormData({...formData, EndDate: e.target.value})}
                            />
                        </div>
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
                            {editingPlan ? "Save Changes" : "Assign Plan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Mess;
