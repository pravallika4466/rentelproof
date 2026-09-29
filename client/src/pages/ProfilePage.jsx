import React, { useState } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, Save, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put('/auth/profile', profileForm);
      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.data.success) {
        showToast('Password changed successfully!', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <CinematicPageTransition className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400">
            Account Management
          </span>
          <Badge variant="primary" size="sm">
            Security & Identity
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-dark-300 mt-1">
          Manage your verified credentials, contact details, and cryptographic password
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Identity Card with 3D Tilt */}
        <TiltCard maxTilt={8} depth={24} className="rounded-3xl">
          <div className="glass-card p-6 sm:p-7 rounded-3xl text-center flex flex-col items-center justify-between h-full border border-brand-500/20 shadow-xl">
            <div className="w-full flex flex-col items-center">
              <div className="relative mb-5 group">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-emerald-glow group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold text-3xl shadow-emerald-glow group-hover:scale-105 transition-transform duration-300">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-500 border-2 border-white dark:border-dark-900 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-xs text-slate-500 dark:text-dark-300 mb-3">{user?.email}</p>

              <Badge variant="primary" size="md" className="capitalize">
                {user?.role?.replace('_', ' ')}
              </Badge>
            </div>

            <div className="w-full pt-6 mt-6 border-t border-slate-200/60 dark:border-dark-700/60 text-left text-xs space-y-3 text-slate-600 dark:text-dark-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 dark:text-dark-400">Account ID:</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-dark-200">
                  {user?.id?.substring(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 dark:text-dark-400">Status:</span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 dark:text-dark-400">Session Role:</span>
                <span className="font-semibold text-slate-800 dark:text-dark-200 capitalize">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Forms Container */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info Form */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/60 dark:border-dark-700/60">
              <User className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Personal Credentials
              </h3>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                  Email Address (Primary Identity)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="glass-input w-full p-2.5 text-xs text-slate-400 dark:text-dark-400 opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                  Avatar Image Link (Unsplash or Cloudinary)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="primary" size="sm" loading={savingProfile} icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/60 dark:border-dark-700/60">
              <KeyRound className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Cryptographic Password
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="secondary" size="sm" loading={savingPassword} icon={Lock}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CinematicPageTransition>
  );
};

export default ProfilePage;
