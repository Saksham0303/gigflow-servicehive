import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

const GigDetail = () => {
  const { gigId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidFormData, setBidFormData] = useState({ message: '', price: '' });
  const [bidError, setBidError] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);

  useEffect(() => {
    fetchGigDetails();
  }, [gigId]);

  const fetchGigDetails = async () => {
    try {
      setLoading(true);
      const [gigResponse, bidsResponse] = await Promise.all([
        api.get(`/gigs/${gigId}`),
        api.get(`/bids/${gigId}`),
      ]);
      setGig(gigResponse.data);
      setBids(bidsResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load gig details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isGigOwner = user?.authenticated && gig && gig.ownerId._id === user.id;

  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setBidError('');

    if (!user?.authenticated) {
      navigate('/login');
      return;
    }

    if (!bidFormData.message.trim() || !bidFormData.price) {
      setBidError('Message and price are required');
      return;
    }

    if (parseFloat(bidFormData.price) <= 0) {
      setBidError('Price must be greater than 0');
      return;
    }

    setBidLoading(true);
    try {
      await api.post('/bids', {
        gigId,
        message: bidFormData.message,
        price: parseFloat(bidFormData.price),
      });
      setBidFormData({ message: '', price: '' });
      await fetchGigDetails();
    } catch (err) {
      setBidError(err.response?.data?.message || 'Failed to submit bid');
    } finally {
      setBidLoading(false);
    }
  };

  const handleHire = async (bidId) => {
    setHireLoading(true);
    try {
      await api.patch(`/bids/${bidId}/hire`);
      await fetchGigDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to hire freelancer');
    } finally {
      setHireLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-blue-200">
          Loading gig details...
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-red-400">
          Gig not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
              <p className="text-blue-200">Posted by {gig.ownerId.name}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg font-medium ${
                gig.status === 'open'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : gig.status === 'assigned'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {gig.status}
            </span>
          </div>

          <p className="text-gray-300 mb-6 whitespace-pre-wrap">{gig.description}</p>

          <div className="border-t border-gray-700 pt-6">
            <div className="text-4xl font-bold text-blue-400">${gig.budget}</div>
            {gig.assignedTo && (
              <p className="text-blue-200 mt-2">Assigned to: {gig.assignedTo.name}</p>
            )}
          </div>
        </div>

        {!isGigOwner && gig.status === 'open' && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Your Bid</h2>

            {bidError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg backdrop-blur-sm">
                {bidError}
              </div>
            )}

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={bidFormData.message}
                  onChange={handleBidChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell the gig owner why you're the best fit for this job..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Your Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={bidFormData.price}
                  onChange={handleBidChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <button
                type="submit"
                disabled={bidLoading}
                className="w-full py-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
              >
                {bidLoading ? 'Submitting...' : 'Submit Bid'}
              </button>
            </form>
          </div>
        )}

        {isGigOwner && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Bids ({bids.length})
            </h2>

            {bids.length === 0 ? (
              <p className="text-blue-200">No bids yet</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid._id} className="border border-gray-700 bg-slate-800/30 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-white">{bid.freelancerId.name}</h3>
                        <p className="text-sm text-blue-200">{bid.freelancerId.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">${bid.price}</div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                            bid.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : bid.status === 'hired'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {bid.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{bid.message}</p>

                    {bid.status === 'pending' && gig.status === 'open' && (
                      <button
                        onClick={() => handleHire(bid._id)}
                        disabled={hireLoading}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {hireLoading ? 'Hiring...' : 'Hire Freelancer'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetail;