import React, { useState, useEffect } from 'react';
import PredictionDrawer from '../components/PredictionDrawer';
import { Brain, Search, Filter, Zap, ArrowUpDown } from 'lucide-react';
import apiClient from '../api/client';

const PredictionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [predictingId, setPredictingId] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/sessions?page=0&size=20');
      if (res.data.success) {
        setSessions(res.data.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handlePredict = async (sessionId) => {
    setPredictingId(sessionId);
    try {
      const res = await apiClient.post(`/predictions/predict/${sessionId}`);
      if (res.data.success) {
        setSelectedPrediction(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPredictingId(null);
    }
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-7 h-7 text-sky-400" />
            Live Machine Learning Risk Stream
          </h1>
          <p className="text-sm text-slate-400">Score active shopper sessions for abandonment risk & SHAP diagnostic drivers</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search session ID or customer name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{filteredSessions.length}</span> active sessions
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((sess) => (
          <div
            key={sess.sessionId}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-400 font-bold">{sess.sessionId}</span>
                <h3 className="text-sm font-semibold text-white mt-0.5">{sess.customerName}</h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${sess.isAbandoned ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {sess.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Cart Value</span>
                <p className="font-bold text-white text-sm">₹{sess.cartValue?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-slate-500">Duration</span>
                <p className="font-medium text-slate-300">{Math.round(sess.sessionDurationSec / 60)} mins</p>
              </div>
              <div>
                <span className="text-slate-500">Checkout Attempts</span>
                <p className="font-medium text-slate-300">{sess.checkoutAttempts}</p>
              </div>
              <div>
                <span className="text-slate-500">Payment Failures</span>
                <p className={`font-bold ${sess.paymentFailures > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {sess.paymentFailures}
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePredict(sess.sessionId)}
              disabled={predictingId === sess.sessionId}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border border-sky-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-sky-400" />
              {predictingId === sess.sessionId ? 'Running Model & SHAP...' : 'Score Risk & Diagnose'}
            </button>
          </div>
        ))}
      </div>

      {selectedPrediction && (
        <PredictionDrawer
          prediction={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
          onActionTriggered={fetchSessions}
        />
      )}
    </div>
  );
};

export default PredictionsPage;
