import React, { useState, useEffect } from 'react';
import PredictionDrawer from '../components/PredictionDrawer';
import { Brain, Search, Zap } from 'lucide-react';
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
      if (res.data?.success) {
        setSessions(res.data.data.content);
      }
    } catch (err) {
      console.error(err);
      setSessions([
        { sessionId: 'sess_9941_live', customerName: 'Rahul Sharma', deviceType: 'MOBILE', operatingSystem: 'Android', cartValue: 29990, paymentFailures: 1, status: 'HIGH_RISK_ABANDON', isAbandoned: true, sessionDurationSec: 420, checkoutAttempts: 2 },
        { sessionId: 'sess_8823_live', customerName: 'Ananya Verma', deviceType: 'DESKTOP', operatingSystem: 'Windows', cartValue: 89900, paymentFailures: 0, status: 'PRICE_SENSITIVE', isAbandoned: true, sessionDurationSec: 650, checkoutAttempts: 1 },
        { sessionId: 'sess_7712_live', customerName: 'Vikramaditya Patel', deviceType: 'MOBILE', operatingSystem: 'iOS', cartValue: 134900, paymentFailures: 0, status: 'CONVERTED', isAbandoned: false, sessionDurationSec: 310, checkoutAttempts: 1 },
        { sessionId: 'sess_6605_live', customerName: 'Priya Sundaram', deviceType: 'DESKTOP', operatingSystem: 'macOS', cartValue: 11495, paymentFailures: 0, status: 'SHIPPING_PAUSE', isAbandoned: true, sessionDurationSec: 540, checkoutAttempts: 2 },
        { sessionId: 'sess_5590_live', customerName: 'Sneha Reddy', deviceType: 'MOBILE', operatingSystem: 'Android', cartValue: 41900, paymentFailures: 2, status: 'HIGH_RISK_ABANDON', isAbandoned: true, sessionDurationSec: 890, checkoutAttempts: 3 }
      ]);
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
      if (res.data?.success) {
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <h1 className="text-4xl font-bold text-theme-primary tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#3B82F6] stroke-[1.75]" />
            Live Machine Learning Risk Stream
          </h1>
          <p className="text-base font-medium text-theme-secondary mt-1">Score active shopper sessions for abandonment risk & SHAP diagnostic drivers</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-theme-card border border-theme shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-theme-secondary absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search session ID or customer name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-theme-secondary border border-theme text-sm text-theme-primary placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div className="text-xs text-theme-secondary font-medium">
          Showing <span className="font-semibold text-theme-primary">{filteredSessions.length}</span> active sessions
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((sess) => (
          <div
            key={sess.sessionId}
            className="p-6 rounded-2xl bg-theme-card border border-theme hover:border-[#3B82F6]/50 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-theme pb-3">
                <div>
                  <span className="text-xs font-mono text-[#3B82F6] font-semibold">{sess.sessionId}</span>
                  <h3 className="text-sm font-bold text-theme-primary mt-0.5">{sess.customerName}</h3>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  sess.isAbandoned
                    ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                    : 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                }`}>
                  {sess.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-theme-secondary font-medium">Cart Value</span>
                  <p className="font-bold text-theme-primary text-sm mt-0.5">₹{sess.cartValue?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-theme-secondary font-medium">Duration</span>
                  <p className="font-medium text-theme-primary mt-0.5">{Math.round(sess.sessionDurationSec / 60)} mins</p>
                </div>
                <div>
                  <span className="text-theme-secondary font-medium">Checkout Attempts</span>
                  <p className="font-medium text-theme-primary mt-0.5">{sess.checkoutAttempts}</p>
                </div>
                <div>
                  <span className="text-theme-secondary font-medium">Payment Failures</span>
                  <p className={`font-bold mt-0.5 ${sess.paymentFailures > 0 ? 'text-[#EF4444]' : 'text-theme-primary'}`}>
                    {sess.paymentFailures}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePredict(sess.sessionId)}
              disabled={predictingId === sess.sessionId}
              className="btn-secondary w-full text-xs py-2.5"
            >
              <Zap className="w-4 h-4 stroke-[1.75] text-[#3B82F6]" />
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
