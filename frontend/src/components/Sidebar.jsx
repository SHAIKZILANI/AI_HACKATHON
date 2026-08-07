import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, BrainCircuit, Activity, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Risk Stream', path: '/predictions', icon: BrainCircuit },
    { label: 'Deep Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>ML Engine: ONLINE</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">XGBoost v2.0 + SHAP Explainability Engine Active</p>
      </div>
    </aside>
  );
};

export default Sidebar;
