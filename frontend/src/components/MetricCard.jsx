import React from 'react';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'sky' }) => {
  const colorMap = {
    sky: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-b border glass-panel ${colorMap[color]} shadow-lg`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && <Icon className="w-5 h-5 opacity-80" />}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
