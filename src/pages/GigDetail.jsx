import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GigDetail = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const user = {
    id: 'user123',
    name: 'Demo User',
  };

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bidMessage, setBidMessage] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGig();
  }, [gigId]);

  const loadGig = () => {
    try {
      const gigs = JSON.parse(localStorage.getItem('gigs') || '[]');
      const foundGig = gigs.find((g) => g._id === gigId);

      if (!foundGig) {
        setError('Gig not found');
        setLoading(false);
        return;
      }

      setGig(foundGig);

      const allBids = JSON.parse(localStorage.getItem('bids') || '[]');
      const gigBids = allBids.filter((b) => b.gigId === gigId);
      setBids(gigBids);
    } catch (err) {
      console.error(err);
      setError('Failed to load gig');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = () => {
    if (!bidMessage || !bidPrice) {
      setError('Message and price required');
      return;
    }

    const newBid = {
      _id: Date.now().toString(),
      gigId,
      gigTitle: gig.title,
      freelancerId: user.id,
      freelancerName: user.name,
      message: bidMessage,
      price: bidPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const storedBids = JSON.parse(localStorage.getItem('bids') || '[]');
    localStorage.setItem('bids', JSON.stringify([...storedBids, newBid]));

    console.log('✅ Bid Created:', newBid);

    setBidMessage('');
    setBidPrice('');
    setError('');
    loadGig();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-200">
        Loading...
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        Gig not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">

        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 mb-6 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-slate-800/40 p-8 rounded-lg border border-white/5 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
          <p className="text-gray-300 mb-4">{gig.description}</p>
          <div className="text-2xl text-blue-400 font-bold">${gig.budget}</div>
        </div>

        <div className="bg-slate-800/40 p-8 rounded-lg border border-white/5 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Place Your Bid</h2>

          {error && (
            <div className="mb-4 text-red-400">{error}</div>
          )}

          <textarea
            value={bidMessage}
            onChange={(e) => setBidMessage(e.target.value)}
            placeholder="Your message"
            className="w-full mb-4 p-3 bg-slate-900 border border-gray-700 rounded text-white"
            rows={4}
          />

          <input
            type="number"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            placeholder="Your price"
            className="w-full mb-4 p-3 bg-slate-900 border border-gray-700 rounded text-white"
          />

          <button
            onClick={handleSubmitBid}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Bid
          </button>
        </div>

        <div className="bg-slate-800/40 p-8 rounded-lg border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-4">
            Bids ({bids.length})
          </h2>

          {bids.length === 0 ? (
            <p className="text-gray-400">No bids yet</p>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className="border border-gray-700 p-4 rounded"
                >
                  <div className="flex justify-between">
                    <span className="text-white font-medium">
                      {bid.freelancerName}
                    </span>
                    <span className="text-blue-400 font-bold">
                      ${bid.price}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2">{bid.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GigDetail;