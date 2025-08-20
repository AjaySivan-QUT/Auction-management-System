import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import AuctionForm from '../components/AuctionForm';
import AuctionList from '../components/AuctionList';

const Auctions = () => {
  const { user, logout } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [editingAuction, setEditingAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      if (!user || !user.token) {
        setError('No valid authentication token');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Don't manually add Authorization header - axiosInstance handles this
        const res = await axiosInstance.get('/api/auctions');
        setAuctions(res.data);
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
        
        if (err.response?.status === 401) {
          // Token is invalid, logout user
          logout();
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to fetch auctions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [user, logout]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading auctions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <AuctionForm 
        auctions={auctions} 
        setAuctions={setAuctions} 
        editingAuction={editingAuction} 
        setEditingAuction={setEditingAuction} 
      />
      <AuctionList 
        auctions={auctions} 
        setAuctions={setAuctions} 
        setEditingAuction={setEditingAuction} 
      />
    </div>
  );
};

export default Auctions;