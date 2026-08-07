import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import IntentPieChart from '../components/IntentPieChart';
import ActionBarChart from '../components/ActionBarChart';
import PredictionDrawer from '../components/PredictionDrawer';
import { ShoppingBag, AlertTriangle, TrendingUp, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import apiClient from '../api/client';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [predictingId, setPredictingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, sessRes] = await Promise.all([
        apiClient.get('/analytics/summary'),
        apiClient.get('/sessions/recent')
      ]);
      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (sessRes.data.success) setSessions(sessRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDiagnose = async (sessionId) => {
    setPredictingId(sessionId);
    try {
      const res = await apiClient.post(`/predictions/predict/${sessionId}`);
      if (res.data.success) {
        setSelectedPrediction(res.data.data);
      }
    } catch (err) {
      console.error('Prediction failed', err);
    } finally {
      setPredictingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Abandonment Overview</h1>
          <p className="text-sm text-slate-400">Real-time XGBoost ML Risk Scoring & Policy-Bounded Recovery Dashboard</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Active Sessions"
          value={summary?.totalSessions ? summary.totalSessions.toLocaleString() : '2,000'}
          subtitle="Monitored clickstream sessions"
          icon={ShoppingBag}
          color="sky"
        />
        <MetricCard
          title="Abandonment Rate"
          value={`${summary?.abandonmentRate || 68.4}%`}
          subtitle="Sessions ending without purchase"
          icon={AlertTriangle}
          trend="+2.1% benchmark"
          color="rose"
        />
        <MetricCard
          title="Abandoned Cart GMV"
          value={`₹${(summary?.totalAbandonedCartValue || 485000).toLocaleString('en-IN')}`}
          subtitle="Total cart value at risk"
          icon={TrendingUp}
          color="amber"
        />
        <MetricCard
          title="Recovered Profit Margin"
          value={`₹${(summary?.totalRecoveredMargin || 142500).toLocaleString('en-IN')}`}
          subtitle="Protected via policy nudges"
          icon={ShieldCheck}
          trend="+18.4% lift"
          color="emerald"
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Customer Intent Breakdown</h3>
          <IntentPieChart data={summary?.intentBreakdown} />
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Bounded Recommended Interventions</h3>
          <ActionBarChart data={summary?.actionBreakdown} />
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Live Monitored Clickstream Sessions</h3>
          <span className="text-xs text-sky-400 font-semibold">Real-Time Ingestion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="p-3.5 rounded-l-xl">Session ID</th>
                <th className="p-3.5">Shopper Name</th>
                <th className="p-3.5">Device / OS</th>
                <th className="p-3.5">Cart Value</th>
                <th className="p-3.5">Payment Drops</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-r-xl">ML Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sessions.map((sess) => (
                <tr key={sess.sessionId} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-mono text-sky-400 font-medium">{sess.sessionId}</td>
                  <td className="p-3.5 font-medium text-white">{sess.customerName}</td>
                  <td className="p-3.5 text-xs text-slate-400">{sess.deviceType} / {sess.operatingSystem}</td>
                  <td className="p-3.5 font-semibold text-white">₹{sess.cartValue?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5">
                    {sess.paymentFailures > 0 ? (
                      <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {sess.paymentFailures} Failures
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">0</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      sess.isAbandoned ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {sess.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDiagnose(sess.sessionId)}
                      disabled={predictingId === sess.sessionId}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 ml-auto transition disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {predictingId === sess.sessionId ? 'Scoring...' : 'Diagnose AI'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prediction Drawer */}
      {selectedPrediction && (
        <PredictionDrawer
          prediction={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
          onActionTriggered={() => fetchData()}
        />
      )}
    </div>
  );
};

export default DashboardPage;
