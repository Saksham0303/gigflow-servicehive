import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('gigs');
  const [formData, setFormData] = useState({ title: '', description: '', budget: '' });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (!user?.authenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gigsResponse, bidsResponse] = await Promise.all([
        api.get('/gigs'),
        api.get('/bids').catch(() => ({ data: [] })),
      ]);

      const userGigs = gigsResponse.data.filter((g) => g.ownerId._id === user.id);
      setGigs(userGigs);

      const userBids = bidsResponse.data.filter((b) => b.freelancerId._id === user.id);
      setBids(userBids);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.budget) {
      setCreateError('All fields are required');
      return;
    }

    if (parseFloat(formData.budget) <= 0) {
      setCreateError('Budget must be greater than 0');
      return;
    }

    setCreateLoading(true);
    try {
      await api.post('/gigs', {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
      });
      setFormData({ title: '', description: '', budget: '' });
      await fetchData();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-blue-200">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'gigs'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            My Gigs ({gigs.length})
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'bids'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            My Bids ({bids.length})
          </button>
        </div>

        {activeTab === 'gigs' && (
          <div>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Gig</h2>

              {createError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg backdrop-blur-sm">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateGig} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Gig Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What do you need done?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Gig'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">My Gigs</h2>
              {gigs.length === 0 ? (
                <p className="text-blue-200 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-6">
                  You haven't created any gigs yet
                </p>
              ) : (
                <div className="space-y-4">
                  {gigs.map((gig) => (
                    <Link
                      key={gig._id}
                      to={`/gigs/${gig._id}`}
                      className="block bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{gig.title}</h3>
                          <p className="text-blue-200 text-sm mt-1 line-clamp-2">
                            {gig.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-blue-400">${gig.budget}</div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
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
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bids' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">My Bids</h2>
            {bids.length === 0 ? (
              <p className="text-blue-200 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-6">
                You haven't placed any bids yet
              </p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid._id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">
                          {bid.gigId.title}
                        </h3>
                        <p className="text-blue-200 text-sm mt-1">
                          Posted by {bid.gigId.ownerId.name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
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
                    <Link
                      to={`/gigs/${bid.gigId._id}`}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      View Gig →
                    </Link>
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

export default Dashboard;