import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  Key,
  Smartphone,
  Mail,
  Lock,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const SettingsPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    depositEscrow: true,
    inspectionSignoff: true,
    maintenanceUpdates: true,
    emailSummary: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometricWebAuthn: false,
    sessionAutoLock: true,
  });

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast('Notification preferences updated', 'info');
      return next;
    });
  };

  const handleToggleSecurity = (key) => {
    setSecurity((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast('Security policy updated', 'success');
      return next;
    });
  };

  return (
    <CinematicPageTransition>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400">
              System Preferences
            </span>
            <Badge variant="primary" size="sm">
              Global Configuration
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings & Appearance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-dark-300 mt-1">
            Customize cinematic environment lighting, cryptographic verification thresholds, and notification alerts
          </p>
        </div>

        {/* 1. Interactive 3D Appearance & Theme Switcher */}
        <TiltCard maxTilt={4} depth={20}>
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-dark-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Cinematic Color Environment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-dark-300">
                    Switch between Obsidian Noir and Linen Alabaster themes (Strict Zero Blue)
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {theme} Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dark Option */}
              <div
                onClick={() => !isDark && toggleTheme()}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  isDark
                    ? 'bg-dark-900/90 border-brand-500 shadow-emerald-glow'
                    : 'bg-slate-100/60 border-slate-200 hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-dark-950 border border-dark-800 flex items-center justify-center text-brand-400 shadow-inner">
                    <Moon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Obsidian Noir</h4>
                    <p className="text-xs text-slate-500 dark:text-dark-400">Deep graphite & radiant emerald</p>
                  </div>
                </div>
                {isDark && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
              </div>

              {/* Light Option */}
              <div
                onClick={() => isDark && toggleTheme()}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  !isDark
                    ? 'bg-white border-brand-500 shadow-emerald-glow'
                    : 'bg-dark-900/40 border-dark-700/60 hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm">
                    <Sun className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Linen Alabaster</h4>
                    <p className="text-xs text-slate-500 dark:text-dark-400">Warm ivory & forest emerald</p>
                  </div>
                </div>
                {!isDark && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 2. Notification Dispatch Controls */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-dark-700/60">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification & Alert Channels</h3>
              <p className="text-xs text-slate-500 dark:text-dark-300">
                Real-time WebSocket alerts and verified audit receipts
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/60 dark:border-dark-700/60">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Security Deposit Escrow Alerts
                </span>
                <span className="text-xs text-slate-500 dark:text-dark-400 block mt-0.5">
                  Receive instant alerts when deposits are funded, claimed, or refunded
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('depositEscrow')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.depositEscrow ? 'bg-brand-500' : 'bg-slate-300 dark:bg-dark-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifications.depositEscrow ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/60 dark:border-dark-700/60">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Inspection Sign-off & Photographic Proof
                </span>
                <span className="text-xs text-slate-500 dark:text-dark-400 block mt-0.5">
                  Alert when condition logs or Move-In baselines are countersigned
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('inspectionSignoff')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.inspectionSignoff ? 'bg-brand-500' : 'bg-slate-300 dark:bg-dark-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifications.inspectionSignoff ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/60 dark:border-dark-700/60">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Maintenance Dispatch & Completion
                </span>
                <span className="text-xs text-slate-500 dark:text-dark-400 block mt-0.5">
                  Work order milestone updates from assigned contractors
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('maintenanceUpdates')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.maintenanceUpdates ? 'bg-brand-500' : 'bg-slate-300 dark:bg-dark-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifications.maintenanceUpdates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Cryptographic Security & Session Safeguards */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-dark-700/60">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Cryptographic Security Safeguards</h3>
              <p className="text-xs text-slate-500 dark:text-dark-300">
                Multi-factor authentication and token protection
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/60 dark:border-dark-700/60">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-xs text-slate-500 dark:text-dark-400 block mt-0.5">
                  Requires time-based one-time password (TOTP) for high-value deposit transfers
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSecurity('twoFactor')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  security.twoFactor ? 'bg-brand-500' : 'bg-slate-300 dark:bg-dark-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    security.twoFactor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/60 dark:border-dark-700/60">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Session Auto-Lock on Idle
                </span>
                <span className="text-xs text-slate-500 dark:text-dark-400 block mt-0.5">
                  Automatically clears cached JWT tokens after 30 minutes of inactivity
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSecurity('sessionAutoLock')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  security.sessionAutoLock ? 'bg-brand-500' : 'bg-slate-300 dark:bg-dark-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    security.sessionAutoLock ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </CinematicPageTransition>
  );
};

export default SettingsPage;
