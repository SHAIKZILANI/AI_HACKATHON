import React, { useState } from 'react';
import { X, Brain, CheckCircle, AlertTriangle, Send, Zap, MessageSquare } from 'lucide-react';
import apiClient from '../api/client';

const PredictionDrawer = ({ prediction, onClose, onActionTriggered }) => {
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  if (!prediction) return null;

  const riskPercent = Math.round(prediction.abandonmentRiskScore * 100);
  const isHighRisk = riskPercent >= 70;

  const handleTriggerAction = async () => {
    setLoadingAction(true);
    setActionSuccess(null);
    try {
      const response = await apiClient.post('/interventions/trigger', {
        sessionId: prediction.sessionId,
        actionType: prediction.recommendedAction,
        channel: prediction.channel || 'WhatsApp',
        recipient: '+919876543210',
        estimatedMarginImpact: 299.00
      });
      if (response.data.success) {
        setActionSuccess(`Triggered ${prediction.recommendedAction} via ${prediction.channel}`);
        if (onActionTriggered) onActionTriggered();
      }
    } catch (err) {
      setActionSuccess('Action failed to dispatch.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto h-full space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Abandonment Diagnostic & Policy</h2>
                <p className="text-xs text-slate-400">Session ID: <span className="font-mono text-sky-400">{prediction.sessionId}</span></p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Gauge Card */}
          <div className={`p-5 rounded-2xl border ${isHighRisk ? 'bg-rose-950/20 border-rose-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Abandonment Risk Score</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${isHighRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{riskPercent}%</span>
              <span className="text-xs text-slate-400">Predicted Probability</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isHighRisk ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${riskPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Customer Intent Section */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Diagnosed Customer Intent</span>
              <span className="text-xs font-semibold text-sky-400">{prediction.intentCategory}</span>
            </div>
            <p className="text-sm text-slate-300">{prediction.intentExplanation}</p>
          </div>

          {/* Human Readable Business Reason (SHAP Summary) */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Explainable AI Diagnostic (SHAP)
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              "{prediction.humanReason}"
            </p>
          </div>

          {/* Feature Importance Breakdown */}
          {prediction.topFeatures && prediction.topFeatures.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Top Risk Drivers</h4>
              <div className="space-y-2">
                {prediction.topFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-300 font-medium">{feat.display_name}</span>
                    <span className="font-mono text-slate-400">Val: {feat.actual_value} (SHAP: {feat.shap_value > 0 ? '+' : ''}{feat.shap_value.toFixed(3)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Intervention Policy Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/30 to-indigo-950/30 border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-sky-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Bounded Policy Recommendation
              </span>
              <span className="text-xs font-bold text-white bg-sky-500/20 px-2.5 py-1 rounded-md border border-sky-500/30">
                {prediction.recommendedAction}
              </span>
            </div>
            <p className="text-sm text-slate-200">{prediction.recommendationReason}</p>
            <div className="text-xs text-emerald-400 font-medium">Impact: {prediction.expectedImpact}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          {actionSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {actionSuccess}
            </div>
          )}

          <button
            onClick={handleTriggerAction}
            disabled={loadingAction}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loadingAction ? 'Dispatching Recovery Nudge...' : `Execute Action (${prediction.recommendedAction})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionDrawer;
