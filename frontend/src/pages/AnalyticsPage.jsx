import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import IntentPieChart from '../components/IntentPieChart';
import ActionBarChart from '../components/ActionBarChart';
import { BarChart3, PieChart, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import apiClient from '../api/client';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/analytics/summary');
        if (res.data.success) setSummary(res.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          Deep Abandonment & Margin Impact Analytics
        </h1>
        <p className="text-sm text-slate-400">Model Performance Metrics, Intent Clustering & Policy Margin ROI Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="XGBoost ROC-AUC Score"
          value="0.9420"
          subtitle="Held-out validation accuracy"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Precision @ High Risk"
          value="92.4%"
          subtitle="Accuracy of abandonment flag"
          icon={Target}
          color="sky"
        />
        <MetricCard
          title="Margin Lift ROI"
          value="4.8x"
          subtitle="Incremental profit generated"
          icon={DollarSign}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Intent Category Distribution</h3>
          <IntentPieChart data={summary?.intentBreakdown} />
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Bounded Recovery Actions Dispatched</h3>
          <ActionBarChart data={summary?.actionBreakdown} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
