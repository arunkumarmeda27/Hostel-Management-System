import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        RoomNumber: '',
        RoomType: 'Single',
        Capacity: '',
        FloorNumber: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRooms(data);
        } catch (error) {
            toast.error('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await api.delete(`/rooms/${id}`);
                toast.success('Room deleted successfully');
                fetchRooms();
            } catch (error) {
                toast.error('Failed to delete room');
            }
        }
    };

    const openAddModal = () => {
        setEditingRoom(null);
        setFormData({ RoomNumber: '', RoomType: 'Single', Capacity: '', FloorNumber: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (room) => {
        setEditingRoom(room);
        setFormData({
            RoomNumber: room.RoomNumber || '',
            RoomType: room.RoomType || 'Single',
            Capacity: room.Capacity || '',
            FloorNumber: room.FloorNumber || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom.RoomID}`, formData);
                toast.success('Room updated successfully');
            } else {
                await api.post('/rooms', formData);
                toast.success('Room added successfully');
            }
            setIsModalOpen(false);
            fetchRooms();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save room');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Empty': return 'bg-emerald-100 text-emerald-800';
            case 'Full': return 'bg-rose-100 text-rose-800';
            default: return 'bg-amber-100 text-amber-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Room</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
                ) : rooms.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No rooms found.</div>
                ) : (
                    rooms.map((room) => (
                        <div key={room.RoomID} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(room)}
                                    className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(room.RoomID)}
                                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Room {room.RoomNumber}</h3>
                                    <p className="text-sm text-gray-500">{room.RoomType} • Floor {room.FloorNumber}</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Occupancy</span>
                                    <span className="font-medium text-gray-900">{room.OccupiedCount} / {room.Capacity}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="bg-indigo-600 h-2 rounded-full" 
                                        style={{ width: `${(room.OccupiedCount / room.Capacity) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="pt-2 flex justify-between items-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(room.OccupancyStatus)}`}>
                                        {room.OccupancyStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingRoom ? "Edit Room" : "Add New Room"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                        <input 
                            required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.RoomNumber} onChange={(e) => setFormData({...formData, RoomNumber: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                        <select 
                            required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={formData.RoomType} onChange={(e) => setFormData({...formData, RoomType: e.target.value})}
                        >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Triple">Triple</option>
                            <option value="Dormitory">Dormitory</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                        <input 
                            required type="number" min="1" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.Capacity} onChange={(e) => setFormData({...formData, Capacity: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number *</label>
                        <input 
                            required type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.FloorNumber} onChange={(e) => setFormData({...formData, FloorNumber: e.target.value})}
                        />
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
                            {editingRoom ? "Save Changes" : "Add Room"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Rooms;
