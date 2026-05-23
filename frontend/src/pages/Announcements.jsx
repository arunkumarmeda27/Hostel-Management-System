import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Megaphone, Trash2, Plus } from 'lucide-react';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ Title: '', Content: '' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/announcements');
            setAnnouncements(data);
        } catch (error) {
            toast.error('Failed to fetch announcements');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', formData);
            toast.success('Announcement posted');
            setShowModal(false);
            setFormData({ Title: '', Content: '' });
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to post announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            toast.success('Announcement deleted');
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to delete announcement');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Hostel Updates</h2>
                {isAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Post Update
                    </button>
                )}
            </div>

            <div className="grid gap-4">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div key={ann.AnnouncementID} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <Megaphone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{ann.Title}</h3>
                                        <p className="text-sm text-gray-500">
                                            Posted by {ann.AdminName} on {new Date(ann.CreatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(ann.AnnouncementID)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                            <div className="text-gray-600 whitespace-pre-wrap pl-13">
                                {ann.Content}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No updates yet.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Post New Update</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.Title}
                                    onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.Content}
                                    onChange={(e) => setFormData({ ...formData, Content: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
