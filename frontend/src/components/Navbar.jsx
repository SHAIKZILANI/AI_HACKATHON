import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Moon, Sun, LogOut, User, Database } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-theme-navbar border-b border-theme sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm transition-colors duration-200">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white shadow-md">
          <Shield className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="font-bold text-base text-theme-primary tracking-tight flex items-center gap-2">
            CartRescue <span className="text-[#3B82F6] font-semibold text-xs px-2 py-0.5 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/20">Enterprise</span>
          </h1>
          <p className="text-xs text-theme-secondary font-medium">Automated Cart Abandonment & Remediation</p>
        </div>
      </div>

      {/* Right Controls Section */}
      <div className="flex items-center gap-4">
        {/* Multi-Store SaaS Selector */}
        <div className="hidden sm:flex items-center">
          <select className="px-3 py-1.5 rounded-xl bg-theme-secondary border border-theme text-xs font-semibold text-theme-primary focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition">
            <option>Store: Amazon Flagship US (Flagship)</option>
            <option>Store: Shopify EU Direct</option>
            <option>Store: WooCommerce India</option>
          </select>
        </div>

        {/* System Status Pills */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-theme-secondary border border-theme text-xs font-medium text-theme-secondary">
          <div className="flex items-center gap-2 text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-semibold text-xs">XGBoost ML v2.0</span>
          </div>
          <span className="text-theme-secondary opacity-40">|</span>
          <div className="flex items-center gap-1.5 text-[#3B82F6]">
            <Database className="w-4 h-4 stroke-[1.75]" />
            <span className="font-semibold text-xs">MySQL Live</span>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-theme-secondary hover:bg-theme-card border border-theme text-theme-secondary hover:text-theme-primary transition shadow-sm"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5 stroke-[1.75] text-[#F59E0B]" /> : <Moon className="w-5 h-5 stroke-[1.75] text-[#3B82F6]" />}
        </button>

        <div className="h-5 w-[1px] bg-theme-secondary opacity-60"></div>

        {/* User Account */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-theme-card border border-theme flex items-center justify-center text-[#3B82F6]">
            <User className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-theme-primary">{user?.fullName || 'System Administrator'}</p>
            <p className="text-[11px] font-mono text-theme-secondary">{user?.role || 'ROLE_ADMIN'}</p>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-theme-secondary hover:bg-[#EF4444]/10 text-theme-secondary hover:text-[#EF4444] border border-theme hover:border-[#EF4444]/30 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
