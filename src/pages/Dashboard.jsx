import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  
  const [user] = useState({
    id: 'user123',
    name: 'Demo User',
    authenticated: true,
  });

  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('gigs');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = () => {
    try {
      setLoading(true);

      const storedGigs = JSON.parse(localStorage.getItem('gigs') || '[]');
      const storedBids = JSON.parse(localStorage.getItem('bids') || '[]');

      setGigs(storedGigs.filter((g) => g.ownerId === user.id));
      setBids(storedBids.filter((b) => b.freelancerId === user.id));

      console.log('🔍 Dashboard Debug:', {
        allBids: storedBids,
        myBids: storedBids.filter((b) => b.freelancerId === user.id),
        userId: user.id
      });

      setError('');
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGig = () => {
    setCreateError('');

    if (!formData.title || !formData.description || !formData.budget) {
      setCreateError('All fields are required');
      return;
    }

    setCreateLoading(true);

    try {
      const storedGigs = JSON.parse(localStorage.getItem('gigs') || '[]');

      const newGig = {
        _id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        ownerId: user.id,
        ownerName: user.name,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('gigs', JSON.stringify([...storedGigs, newGig]));

      setFormData({ title: '', description: '', budget: '' });
      fetchData();
    } catch {
      setCreateError('Failed to create gig');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteGig = (gigId) => {
    const storedGigs = JSON.parse(localStorage.getItem('gigs') || '[]');
    localStorage.setItem(
      'gigs',
      JSON.stringify(storedGigs.filter((g) => g._id !== gigId))
    );
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-200">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <div className="text-blue-400">👋 {user.name}</div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`pb-2 ${
              activeTab === 'gigs'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400'
            }`}
          >
            My Gigs ({gigs.length})
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`pb-2 ${
              activeTab === 'bids'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400'
            }`}
          >
            My Bids ({bids.length})
          </button>
        </div>

        {activeTab === 'gigs' && (
          <>
            <div className="bg-slate-800/40 p-8 rounded-lg border border-white/5 mb-8">
              <h2 className="text-2xl text-white font-bold mb-4">
                Create New Gig
              </h2>

              {createError && (
                <div className="mb-4 text-red-400">{createError}</div>
              )}

              <div className="space-y-4">
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Gig Title"
                  className="w-full p-2 bg-slate-900 border border-gray-700 text-white rounded"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  rows="4"
                  className="w-full p-2 bg-slate-900 border border-gray-700 text-white rounded"
                />

                <input
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleFormChange}
                  placeholder="Budget"
                  className="w-full p-2 bg-slate-900 border border-gray-700 text-white rounded"
                />

                <button
                  onClick={handleCreateGig}
                  disabled={createLoading}
                  className="w-full py-2 bg-blue-500 rounded text-white"
                >
                  {createLoading ? 'Creating...' : 'Create Gig'}
                </button>
              </div>
            </div>

            <h2 className="text-2xl text-white font-bold mb-4">My Gigs</h2>

            {gigs.length === 0 ? (
              <p className="text-blue-200">No gigs created yet</p>
            ) : (
              <div className="space-y-4">
                {gigs.map((gig) => (
                  <Link
                    key={gig._id}
                    to={`/gigs/${gig._id}`}
                    className="block bg-slate-800/40 p-6 rounded-lg border border-white/5 hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl text-white font-semibold">
                          {gig.title}
                        </h3>
                        <p className="text-blue-200 text-sm">
                          {gig.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-blue-400 text-xl font-bold">
                          ${gig.budget}
                        </div>
                        <span className="text-green-400 text-sm">
                          {gig.status}
                        </span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteGig(gig._id);
                          }}
                          className="block mt-2 text-xs text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'bids' && (
          <>
            <h2 className="text-2xl text-white font-bold mb-4">My Bids</h2>

            {bids.length === 0 ? (
              <p className="text-blue-200">No bids placed yet</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <Link
                    key={bid._id}
                    to={`/gigs/${bid.gigId}`}
                    className="block bg-slate-800/40 p-6 rounded-lg border border-white/5 hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-semibold">
                          {bid.gigTitle}
                        </h3>
                        <p className="text-gray-300">{bid.message}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-blue-400 font-bold">
                          ${bid.price}
                        </div>
                        <span className="text-yellow-400 text-sm">
                          {bid.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;