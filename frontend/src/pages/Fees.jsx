import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [formData, setFormData] = useState({
        StudentID: '',
        Amount: '',
        DueDate: '',
        PaymentStatus: 'Pending'
    });

    useEffect(() => {
        fetchFees();
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch students');
        }
    };

    const fetchFees = async () => {
        try {
            const { data } = await api.get('/fees');
            setFees(data);
        } catch (error) {
            toast.error('Failed to fetch fees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this fee record?')) {
            try {
                await api.delete(`/fees/${id}`);
                toast.success('Fee record deleted successfully');
                fetchFees();
            } catch (error) {
                toast.error('Failed to delete fee record');
            }
        }
    };

    const openAddModal = () => {
        setEditingFee(null);
        setFormData({ StudentID: '', Amount: '', DueDate: '', PaymentStatus: 'Pending' });
        setIsModalOpen(true);
    };

    const openEditModal = (fee) => {
        setEditingFee(fee);
        // Format date for the date input (YYYY-MM-DD)
        const formattedDate = fee.DueDate ? new Date(fee.DueDate).toISOString().split('T')[0] : '';
        setFormData({
            StudentID: fee.StudentID || '',
            Amount: fee.Amount || '',
            DueDate: formattedDate,
            PaymentStatus: fee.PaymentStatus || 'Pending'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFee) {
                await api.put(`/fees/${editingFee.FeeID}`, formData);
                toast.success('Fee record updated successfully');
            } else {
                await api.post('/fees', formData);
                toast.success('Fee record added successfully');
            }
            setIsModalOpen(false);
            fetchFees();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save fee record');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-800';
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Overdue': return 'bg-rose-100 text-rose-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Fee Record</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Record ID</th>
                                <th className="px-6 py-4 font-medium">Student Name</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : fees.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No fee records found.</td></tr>
                            ) : (
                                fees.map((fee) => (
                                    <tr key={fee.FeeID} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">#{fee.FeeID}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{fee.FullName}</div>
                                            <div className="text-xs text-gray-500">Student ID: {fee.StudentID}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{fee.Amount}</td>
                                        <td className="px-6 py-4 text-gray-600">{new Date(fee.DueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.PaymentStatus)}`}>
                                                {fee.PaymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => openEditModal(fee)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(fee.FeeID)}
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
                title={editingFee ? "Edit Fee Record" : "Add New Fee Record"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                        <select 
                            required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={formData.StudentID} 
                            onChange={(e) => {
                                const studentId = e.target.value;
                                const selectedStudent = students.find(s => s.StudentID.toString() === studentId);
                                
                                // Calculate fee based on year (New student = Year 1)
                                let calculatedAmount = formData.Amount;
                                if (selectedStudent) {
                                    if (selectedStudent.Year == 1) {
                                        calculatedAmount = '185000'; // 180k + 5k security deposit
                                    } else {
                                        calculatedAmount = '180000'; // Standard fee
                                    }
                                }
                                
                                setFormData({
                                    ...formData, 
                                    StudentID: studentId,
                                    Amount: calculatedAmount
                                });
                            }}
                        >
                            <option value="">-- Select a Student --</option>
                            {students.map(student => (
                                <option key={student.StudentID} value={student.StudentID}>
                                    #{student.StudentID} - {student.FullName} (Year {student.Year})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                        <input 
                            required type="number" step="0.01" min="0" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.Amount} onChange={(e) => setFormData({...formData, Amount: e.target.value})}
                        />
                        {formData.Amount === '185000' && <p className="text-xs text-indigo-600 mt-1">Includes ₹5,000 first-time security deposit</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                        <input 
                            required type="date" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.DueDate} onChange={(e) => setFormData({...formData, DueDate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status *</label>
                        <select 
                            required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={formData.PaymentStatus} onChange={(e) => setFormData({...formData, PaymentStatus: e.target.value})}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
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
                            className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                            {editingFee ? "Save Changes" : "Add Record"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Fees;
