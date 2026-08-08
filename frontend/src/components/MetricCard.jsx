import React from 'react';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  return (
    <div className="p-6 rounded-2xl bg-theme-card border border-theme hover:border-[#3B82F6]/50 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 h-full flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-theme-secondary">{title}</span>
          {Icon && (
            <div className="p-2 rounded-xl bg-theme-secondary border border-theme text-[#3B82F6]">
              <Icon className="w-5 h-5 stroke-[1.75]" />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="text-4xl font-bold text-theme-primary font-sans tracking-tight">{value}</h3>
          {trend && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {trend}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="text-xs text-theme-secondary font-medium mt-3 border-t border-theme opacity-80 pt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
