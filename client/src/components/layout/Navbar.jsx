import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  CheckCheck,
  LayoutGrid,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Badge from '../common/Badge';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const roleColors = {
    landlord: 'primary',
    tenant: 'teal',
    service_provider: 'warning',
    admin: 'purple',
  };

  const roleLabels = {
    landlord: 'Landlord Workspace',
    tenant: 'Tenant Portal',
    service_provider: 'Service Technician',
    admin: 'Platform Admin',
  };

  const getSectionName = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-light-400 dark:border-dark-800 glass-header px-4 sm:px-6 transition-all duration-300">
      {/* Left: Mobile Toggle & Minimal Clean Workspace Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-dark-600 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-800 transition active:scale-95 interactive"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group interactive">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-dark-900 text-brand-400 border border-brand-500/30 shadow-sm group-hover:border-brand-500 transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-dark-900 dark:text-dark-100">
            <span className="text-dark-400 font-normal">/</span>
            <span className="font-bold tracking-tight">{getSectionName()}</span>
          </div>
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Role Badge */}
        {user && (
          <Badge variant={roleColors[user.role] || 'primary'} size="md" dot className="hidden sm:inline-flex font-semibold">
            {roleLabels[user.role] || user.role}
          </Badge>
        )}

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={`relative p-2.5 rounded-xl transition-all cursor-pointer interactive ${
              showNotifications
                ? 'bg-light-200 dark:bg-dark-800 text-dark-900 dark:text-dark-100'
                : 'text-dark-600 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-dark-100'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-light-50 dark:ring-dark-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-light-50 dark:bg-dark-900 p-3 shadow-card-hover border border-light-400 dark:border-dark-700/80 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-3 py-2 border-b border-light-300 dark:border-dark-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-dark-900 dark:text-dark-50 text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold flex items-center gap-1 transition cursor-pointer interactive"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-light-200 dark:divide-dark-800/80 mt-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-dark-400">No notifications yet</div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-3 rounded-xl transition cursor-pointer hover:bg-light-100 dark:hover:bg-dark-800 ${
                        !n.isRead ? 'bg-brand-500/10 dark:bg-brand-500/10 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-dark-900 dark:text-dark-100">{n.title}</p>
                        <span className="text-[10px] text-dark-400 shrink-0">
                          {new Date(n.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-dark-600 dark:text-dark-300 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl transition-all cursor-pointer interactive ${
              showUserMenu ? 'bg-light-200 dark:bg-dark-800' : 'hover:bg-light-200 dark:hover:bg-dark-800'
            }`}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-emerald-glow">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-dark-900 dark:text-dark-100 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-dark-500 dark:text-dark-400 leading-tight capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-light-50 dark:bg-dark-900 p-2 shadow-card-hover border border-light-400 dark:border-dark-700/80 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-light-300 dark:border-dark-800 mb-1">
                <p className="text-xs font-bold text-dark-900 dark:text-dark-100">{user?.name}</p>
                <p className="text-[11px] text-dark-500 dark:text-dark-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-dark-700 dark:text-dark-200 rounded-xl hover:bg-light-200 dark:hover:bg-dark-800 transition interactive"
              >
                <UserIcon className="w-4 h-4 text-dark-400" /> My Profile & Security
              </Link>

              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-dark-700 dark:text-dark-200 rounded-xl hover:bg-light-200 dark:hover:bg-dark-800 transition interactive"
              >
                <Settings className="w-4 h-4 text-dark-400" /> Settings & Appearance
              </Link>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-500/10 transition cursor-pointer interactive"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
