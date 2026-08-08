import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, BrainCircuit, Activity, Sparkles, ShoppingCart, Sliders } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Risk Stream', path: '/predictions', icon: BrainCircuit },
    { label: 'Deep Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Smart Policy Rules', path: '/policy-rules', icon: Sliders },
    { label: 'AI Copywriter Specialist', path: '/ai-copywriter', icon: Sparkles, badge: 'AI' },
    { label: 'Live Storefront Demo', path: '/storefront', icon: ShoppingCart, badge: 'LIVE' },
  ];

  return (
    <aside className="w-60 bg-theme-sidebar border-r border-theme min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 transition-colors duration-200">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-[11px] font-bold text-theme-secondary uppercase tracking-wider">Navigation</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-card'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-white' : 'text-theme-secondary'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-[#3B82F6]/20 text-[#3B82F6]'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 rounded-2xl bg-theme-card border border-theme space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
          <Activity className="w-4 h-4 stroke-[1.75]" />
          <span>ML Engine: ONLINE</span>
        </div>
        <p className="text-xs text-theme-secondary leading-relaxed">
          XGBoost v2.0 & SHAP active.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
