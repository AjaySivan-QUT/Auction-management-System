import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AuctionList = ({ auctions, setAuctions, setEditingAuction }) => {
  const { user } = useAuth();

  const handleDelete = async (id)=>{
    try{
      await axiosInstance.delete(`/api/auctions/${id}`, { headers:{Authorization:`Bearer ${user.token}`} });
      setAuctions(auctions.filter(a=>a._id!==id));
    }catch(err){ alert('Failed to delete auction'); }
  };

  return (
    <div>
      {auctions.map(a=>(
        <div key={a._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold text-lg">{a.title}</h2>
          <p>{a.description}</p>
          <p className="text-sm">Start: {new Date(a.startDate).toLocaleDateString()} | End: {new Date(a.endDate).toLocaleDateString()}</p>
          <p className="text-sm">Starting Price: ${a.startingPrice}</p>
          <div className="mt-2">
            <button onClick={()=>setEditingAuction(a)} className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
            <button onClick={()=>handleDelete(a._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuctionList;
