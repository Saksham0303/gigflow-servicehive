import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const demoGigs = [
  {
    _id: 'demo-1',
    title: 'Build a Landing Page for Startup',
    description: 'Need a responsive landing page using React and Tailwind CSS.',
    budget: 5000,
    status: 'open',
    isDemo: true,
    ownerId: { name: 'GigFlow Team' },
  },
  {
    _id: 'demo-2',
    title: 'Fix Bugs in React Application',
    description: 'Looking for a React developer to fix UI and logic bugs.',
    budget: 3000,
    status: 'open',
    isDemo: true,
    ownerId: { name: 'GigFlow Team' },
  },
  {
    _id: 'demo-3',
    title: 'Node.js API Optimization',
    description: 'Optimize existing Node.js APIs and improve performance.',
    budget: 7000,
    status: 'open',
    isDemo: true,
    ownerId: { name: 'GigFlow Team' },
  },
];

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gigs');
      const realGigs = response.data || [];

      setGigs([...demoGigs, ...realGigs]);
      setError('');
    } catch (err) {
      setError('Failed to load gigs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter((gig) =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Gigs</h1>
          <input
            type="text"
            placeholder="Search gigs by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-blue-200 py-12">Loading gigs...</div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center text-blue-200 py-12">
            No gigs found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <Link
                key={gig._id}
                to={gig.isDemo ? '#' : `/gigs/${gig._id}`}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/5 p-6 transition ${
                  gig.isDemo
                    ? 'cursor-default opacity-90'
                    : 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white flex-1">
                    {gig.title}
                    {gig.isDemo && (
                      <span className="ml-2 text-xs px-2 py-1 bg-gray-700 rounded">
                        Demo
                      </span>
                    )}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    {gig.status}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {gig.description}
                </p>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-400">
                      ${gig.budget}
                    </span>
                    <span className="text-xs text-blue-200">
                      by {gig.ownerId?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
