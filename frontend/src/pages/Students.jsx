import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        FullName: '',
        Department: '',
        Year: '',
        PhoneNumber: '',
        Email: '',
        Address: '',
        ParentContact: '',
        RoomID: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                toast.success('Student deleted successfully');
                fetchStudents();
            } catch (error) {
                toast.error('Failed to delete student');
            }
        }
    };

    const openAddModal = () => {
        setEditingStudent(null);
        setFormData({
            FullName: '', Department: '', Year: '', PhoneNumber: '', 
            Email: '', Address: '', ParentContact: '', RoomID: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setFormData({
            FullName: student.FullName || '',
            Department: student.Department || '',
            Year: student.Year || '',
            PhoneNumber: student.PhoneNumber || '',
            Email: student.Email || '',
            Address: student.Address || '',
            ParentContact: student.ParentContact || '',
            RoomID: student.RoomID || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.RoomID) payload.RoomID = null; // Handle empty RoomID as null

            if (editingStudent) {
                await api.put(`/students/${editingStudent.StudentID}`, payload);
                toast.success('Student updated successfully');
            } else {
                await api.post('/students', payload);
                toast.success('Student added successfully');
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save student');
        }
    };

    const filteredStudents = students.filter(s => 
        s.FullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.Department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Student</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Department</th>
                                <th className="px-6 py-4 font-medium">Room</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No students found.</td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.StudentID} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">#{student.StudentID}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{student.FullName}</div>
                                            <div className="text-gray-500 text-xs">{student.Email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{student.Department}</td>
                                        <td className="px-6 py-4">
                                            {student.RoomNumber ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    Room {student.RoomNumber}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{student.PhoneNumber}</td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => openEditModal(student)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(student.StudentID)}
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
                title={editingStudent ? "Edit Student" : "Add New Student"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input 
                                required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.FullName} onChange={(e) => setFormData({...formData, FullName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input 
                                required type="email" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                            <input 
                                required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.Department} onChange={(e) => setFormData({...formData, Department: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                            <input 
                                required type="number" min="1" max="5" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.Year} onChange={(e) => setFormData({...formData, Year: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input 
                                required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.PhoneNumber} onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact *</label>
                            <input 
                                required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.ParentContact} onChange={(e) => setFormData({...formData, ParentContact: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea 
                                rows="2" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.Address} onChange={(e) => setFormData({...formData, Address: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Room ID (Optional)</label>
                            <input 
                                type="number" placeholder="Enter Room ID" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={formData.RoomID} onChange={(e) => setFormData({...formData, RoomID: e.target.value})}
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave blank to unassign or assign later.</p>
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
                            className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                            {editingStudent ? "Save Changes" : "Add Student"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Students;
