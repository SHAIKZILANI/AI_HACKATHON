import React, { useState } from 'react';
import { X, Brain, CheckCircle, Send, Zap, MessageSquare } from 'lucide-react';
import apiClient from '../api/client';

const PredictionDrawer = ({ prediction, onClose, onActionTriggered }) => {
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState('9876543210');

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
      if (response.data?.success) {
        setActionSuccess(`Triggered ${prediction.recommendedAction} via ${prediction.channel}`);
        if (onActionTriggered) onActionTriggered();
      }
    } catch (err) {
      setActionSuccess('Action failed to dispatch.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenWhatsApp = (e) => {
    e.preventDefault();
    const promptedNumber = window.prompt("Enter Target WhatsApp Mobile Number (e.g. 9876543210):", whatsappPhone || "");
    if (!promptedNumber) return;

    const rawDigits = promptedNumber.replace(/[^0-9]/g, '');
    const finalPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    setWhatsappPhone(promptedNumber);

    const messageText = `Hi! We noticed your checkout for session ${prediction.sessionId} was interrupted. Click to retry payment via WhatsApp: https://cartrescue.ai/pay/${prediction.sessionId}`;

    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-theme-card border-l border-theme p-6 overflow-y-auto h-full space-y-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                <Brain className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-theme-primary">Abandonment Diagnostic & Policy</h2>
                <p className="text-xs font-mono text-theme-secondary">Session ID: <span className="text-[#3B82F6] font-semibold">{prediction.sessionId}</span></p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-theme-secondary hover:text-theme-primary rounded-xl bg-theme-secondary border border-theme">
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>

          {/* Risk Gauge Card */}
          <div className={`p-5 rounded-2xl border ${isHighRisk ? 'bg-[#EF4444]/10 border-[#EF4444]/30' : 'bg-[#10B981]/10 border-[#10B981]/30'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-theme-secondary">Abandonment Risk Score</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isHighRisk ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#10B981]/20 text-[#10B981]'}`}>
                {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-theme-primary font-sans">{riskPercent}%</span>
              <span className="text-xs text-theme-secondary">Predicted Probability</span>
            </div>
            <div className="w-full bg-theme-secondary h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isHighRisk ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`}
                style={{ width: `${riskPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Customer Intent Section */}
          <div className="p-4 rounded-xl bg-theme-secondary border border-theme space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-theme-secondary uppercase">Diagnosed Customer Intent</span>
              <span className="text-xs font-semibold text-[#3B82F6]">{prediction.intentCategory}</span>
            </div>
            <p className="text-sm text-theme-primary font-medium">{prediction.intentExplanation}</p>
          </div>

          {/* Explainable AI Diagnostic (SHAP Summary) */}
          <div className="p-4 rounded-xl bg-theme-secondary border border-theme space-y-2">
            <h4 className="text-xs font-semibold text-theme-secondary uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#3B82F6] stroke-[1.75]" />
              Explainable AI Diagnostic (SHAP)
            </h4>
            <p className="text-sm text-theme-primary leading-relaxed font-medium bg-theme-card p-3 rounded-lg border border-theme">
              "{prediction.humanReason}"
            </p>
          </div>

          {/* Feature Importance Breakdown */}
          {prediction.topFeatures && prediction.topFeatures.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-theme-secondary uppercase">Top Risk Drivers</h4>
              <div className="space-y-2">
                {prediction.topFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-theme-secondary border border-theme">
                    <span className="text-theme-primary font-medium">{feat.display_name}</span>
                    <span className="font-mono text-theme-secondary">Val: {feat.actual_value} (SHAP: {feat.shap_value > 0 ? '+' : ''}{feat.shap_value.toFixed(3)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Intervention Policy Card */}
          <div className="p-5 rounded-2xl bg-theme-secondary border border-[#3B82F6]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[#3B82F6] flex items-center gap-1.5">
                <Zap className="w-4 h-4 stroke-[1.75]" /> Bounded Policy Recommendation
              </span>
              <span className="text-xs font-semibold text-white bg-[#3B82F6] px-2.5 py-1 rounded-md">
                {prediction.recommendedAction}
              </span>
            </div>
            <p className="text-sm text-theme-primary font-medium">{prediction.recommendationReason}</p>
            <div className="text-xs text-[#10B981] font-semibold">Impact: {prediction.expectedImpact}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-theme pt-4 space-y-3">
          {actionSuccess && (
            <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 stroke-[1.75]" />
              {actionSuccess}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-theme-secondary uppercase">
              Target Phone Number for WhatsApp Dispatch
            </label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-3.5 py-2 rounded-xl bg-theme-secondary border border-theme text-[#10B981] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleTriggerAction}
              disabled={loadingAction}
              className="btn-primary py-2.5 text-xs"
            >
              <Send className="w-4 h-4 stroke-[1.75]" />
              {loadingAction ? 'Dispatching...' : `Execute ${prediction.recommendedAction}`}
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 stroke-[1.75]" />
              Open WhatsApp Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDrawer;
