import React, { useState } from 'react';
import { Sliders, Plus, Trash2, ToggleLeft, ToggleRight, Sparkles, X } from 'lucide-react';

const INITIAL_RULES = [
  {
    id: 1,
    name: 'Automatic Payment Failure Recovery',
    condition: 'Payment Failures >= 1 AND Risk Score > 75%',
    intentCategory: 'Payment Issue',
    action: 'Send WhatsApp UPI Retry Link',
    channel: 'WhatsApp',
    marginCap: '₹500.00',
    enabled: true,
  },
  {
    id: 2,
    name: 'Price Sensitive High-Value Retention',
    condition: 'Cart Value > ₹25,000 AND Revisits >= 3',
    intentCategory: 'Price Sensitive',
    action: 'Offer Bounded 15% Discount Code',
    channel: 'Exit-Intent Popup',
    marginCap: '15.0%',
    enabled: true,
  },
  {
    id: 3,
    name: 'Shipping Hesitation Fee Waiver',
    condition: 'Intent == Delivery Concern AND Duration > 400s',
    intentCategory: 'Delivery Concern',
    action: 'Issue Free Express Shipping Waiver',
    channel: 'On-Site Banner',
    marginCap: '₹150.00',
    enabled: true,
  },
  {
    id: 4,
    name: 'VIP High-Net-Worth Concierge Alert',
    condition: 'Cart Value > ₹75,000',
    intentCategory: 'VIP Shopper',
    action: 'Assign Dedicated Manager Priority Call',
    channel: 'Internal CRM',
    marginCap: 'N/A',
    enabled: false,
  },
];

const PolicyRulesPage = () => {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    intentCategory: 'Price Sensitive',
    action: 'Offer Bounded 10% Discount',
    channel: 'WhatsApp',
    marginCap: '₹300.00',
  });

  const toggleRule = (id) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteRule = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRule.name) return;
    const ruleObj = {
      id: Date.now(),
      name: newRule.name,
      condition: `Intent == ${newRule.intentCategory} AND Risk > 70%`,
      intentCategory: newRule.intentCategory,
      action: newRule.action,
      channel: newRule.channel,
      marginCap: newRule.marginCap,
      enabled: true,
    };
    setRules([ruleObj, ...rules]);
    setShowCreateModal(false);
    setNewRule({
      name: '',
      intentCategory: 'Price Sensitive',
      action: 'Offer Bounded 10% Discount',
      channel: 'WhatsApp',
      marginCap: '₹300.00',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <h1 className="text-4xl font-bold text-theme-primary tracking-tight flex items-center gap-3">
            <Sliders className="w-8 h-8 text-[#3B82F6] stroke-[1.75]" />
            Smart Recovery Policy Rules
          </h1>
          <p className="text-base font-medium text-theme-secondary mt-1">
            Define margin-safe automated rules triggered when ML risk scores cross thresholds.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs"
        >
          <Plus className="w-4 h-4 stroke-[1.75]" /> Create Automated Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-6 rounded-2xl bg-theme-card border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-md hover:border-[#3B82F6]/50 hover:scale-[1.02] ${
              rule.enabled ? 'border-theme' : 'border-theme opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
                  {rule.intentCategory}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="text-theme-secondary hover:text-theme-primary transition"
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-6 h-6 text-[#10B981] stroke-[1.75]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-theme-secondary stroke-[1.75]" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-1 text-theme-secondary hover:text-[#EF4444] transition"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.75]" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-theme-primary">{rule.name}</h3>

              <div className="p-3 rounded-xl bg-theme-secondary border border-theme text-xs font-mono text-theme-primary">
                <span className="text-theme-secondary">IF: </span>
                {rule.condition}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Action:</span>
                  <span className="font-semibold text-[#10B981]">{rule.action}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Channel:</span>
                  <span className="font-semibold text-theme-primary">{rule.channel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Margin Guardrail Cap:</span>
                  <span className="font-semibold text-[#F59E0B] font-mono">{rule.marginCap}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-theme flex items-center justify-between text-xs text-theme-secondary font-medium">
              <span>Status: {rule.enabled ? 'ACTIVE' : 'PAUSED'}</span>
              {rule.enabled && <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <form
            onSubmit={handleCreateRule}
            className="w-full max-w-lg bg-theme-card border border-theme rounded-2xl p-6 shadow-2xl space-y-5 relative"
          >
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-theme-secondary hover:text-theme-primary rounded-full bg-theme-secondary"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </button>

            <div className="flex items-center gap-3 border-b border-theme pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center">
                <Sparkles className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">Create Smart Policy Rule</h3>
                <p className="text-xs text-theme-secondary">Set automatic thresholds for AI action dispatch.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI Payment Fail Fast Trigger"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                  Target Intent Category
                </label>
                <select
                  value={newRule.intentCategory}
                  onChange={(e) => setNewRule({ ...newRule, intentCategory: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="Price Sensitive">Price Sensitive</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Delivery Concern">Delivery Concern</option>
                  <option value="Save For Later">Save For Later</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                  Action to Execute
                </label>
                <input
                  type="text"
                  required
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3"
            >
              Save & Enable Policy Rule
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PolicyRulesPage;
