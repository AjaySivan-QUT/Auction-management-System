import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AuctionForm = ({ auctions, setAuctions, editingAuction, setEditingAuction }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    endDate: '', // Remove startDate, only need endDate for auctionEndTime
    startingPrice: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingAuction) {
      // Format dates for input fields if they exist
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };

      setFormData({
        title: editingAuction.title || '',
        description: editingAuction.description || '',
        endDate: formatDate(editingAuction.auctionEndTime), // Use auctionEndTime from backend
        startingPrice: editingAuction.startingPrice?.toString() || ''
      });
    } else {
      setFormData({ 
        title: '', 
        description: '', 
        endDate: '', 
        startingPrice: '' 
      });
    }
    setError('');
  }, [editingAuction]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.endDate) {
      setError('Auction end date is required');
      return false;
    }
    if (!formData.startingPrice || formData.startingPrice <= 0) {
      setError('Starting price must be greater than 0');
      return false;
    }

    const endDate = new Date(formData.endDate);
    const now = new Date();
    
    if (endDate <= now) {
      setError('Auction end date must be in the future');
      return false;
    }

    if (!user?.id && !user?._id) {
      setError('User authentication error. Please login again.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data with proper types matching backend schema
      const startingPriceNum = parseFloat(formData.startingPrice);
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: startingPriceNum,
        currentPrice: startingPriceNum, // Initialize currentPrice to startingPrice
        auctionEndTime: new Date(formData.endDate).toISOString(), // Backend expects auctionEndTime, not endDate
        createdBy: user.id || user._id // Add required createdBy field
      };

      console.log('Submitting auction data:', submitData);

      if (editingAuction) {
        // Update existing auction - remove duplicate headers
        const res = await axiosInstance.put(`/api/auctions/${editingAuction._id}`, submitData);
        setAuctions(auctions.map(a => a._id === res.data._id ? res.data : a));
      } else {
        // Create new auction - remove duplicate headers
        const res = await axiosInstance.post('/api/auctions', submitData);
        setAuctions([...auctions, res.data]);
      }
      
      setEditingAuction(null);
      setFormData({ 
        title: '', 
        description: '', 
        endDate: '', 
        startingPrice: '' 
      });
    } catch (err) {
      console.error('Failed to save auction:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Invalid data. Please check all fields.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError('Failed to save auction. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingAuction(null);
    setFormData({ 
      title: '', 
      description: '', 
      endDate: '', 
      startingPrice: '' 
    });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingAuction ? 'Edit Auction' : 'Create Auction'}
      </h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <input 
        type="text" 
        placeholder="Title" 
        value={formData.title} 
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        disabled={loading}
        required
      />
      
      <textarea 
        placeholder="Description" 
        value={formData.description} 
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded h-24 resize-vertical"
        disabled={loading}
        required
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Auction End Date & Time</label>
        <input 
          type="datetime-local" 
          value={formData.endDate} 
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={loading}
          required
        />
      </div>
      
      <input 
        type="number" 
        placeholder="Starting Price" 
        value={formData.startingPrice}
        onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        min="0.01"
        step="0.01"
        disabled={loading}
        required
      />
      
      <div className="flex gap-2">
        <button 
          type="submit" 
          className={`flex-1 p-2 rounded text-white ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Saving...' : (editingAuction ? 'Update' : 'Create')}
        </button>
        
        {editingAuction && (
          <button 
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AuctionForm;