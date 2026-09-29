import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardCheck,
  SplitSquareVertical,
  Wrench,
  CreditCard,
  PiggyBank,
  FileText,
  Printer,
  History,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'landlord':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Properties', to: '/properties', icon: Building2 },
          { name: 'Tenancies & Invites', to: '/tenancies', icon: Users },
          { name: 'Inspections', to: '/inspections', icon: ClipboardCheck },
          { name: 'Before vs After', to: '/inspections/compare', icon: SplitSquareVertical },
          { name: 'Maintenance', to: '/maintenance', icon: Wrench },
          { name: 'Rent Payments', to: '/payments', icon: CreditCard },
          { name: 'Security Deposits', to: '/deposits', icon: PiggyBank },
          { name: 'Document Vault', to: '/documents', icon: FileText },
          { name: 'Audit Reports', to: '/reports', icon: Printer },
          { name: 'Audit Trail', to: '/audit-logs', icon: History },
          { name: 'Settings & Theme', to: '/settings', icon: Settings },
        ];
      case 'tenant':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
          { name: 'My Rental Property', to: '/properties', icon: Building2 },
          { name: 'Tenancy Details', to: '/tenancies', icon: Users },
          { name: 'Condition Inspections', to: '/inspections', icon: ClipboardCheck },
          { name: 'Before vs After', to: '/inspections/compare', icon: SplitSquareVertical },
          { name: 'Maintenance Requests', to: '/maintenance', icon: Wrench },
          { name: 'Rent Ledger', to: '/payments', icon: CreditCard },
          { name: 'Security Deposit', to: '/deposits', icon: PiggyBank },
          { name: 'Documents', to: '/documents', icon: FileText },
          { name: 'Inspection Reports', to: '/reports', icon: Printer },
          { name: 'Settings & Theme', to: '/settings', icon: Settings },
        ];
      case 'service_provider':
        return [
          { name: 'Technician Dashboard', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Work Orders', to: '/maintenance', icon: Wrench },
          { name: 'Work Documents', to: '/documents', icon: FileText },
          { name: 'My Profile', to: '/profile', icon: UserCheck },
          { name: 'Settings & Theme', to: '/settings', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Admin Overview', to: '/admin', icon: ShieldAlert },
          { name: 'User Management', to: '/admin/users', icon: Users },
          { name: 'All Properties', to: '/properties', icon: Building2 },
          { name: 'Tenancies', to: '/tenancies', icon: Users },
          { name: 'Inspections', to: '/inspections', icon: ClipboardCheck },
          { name: 'Before vs After', to: '/inspections/compare', icon: SplitSquareVertical },
          { name: 'Maintenance', to: '/maintenance', icon: Wrench },
          { name: 'Payments Ledger', to: '/payments', icon: CreditCard },
          { name: 'Deposits', to: '/deposits', icon: PiggyBank },
          { name: 'Platform Audit Log', to: '/audit-logs', icon: History },
          { name: 'Settings & Theme', to: '/settings', icon: Settings },
        ];
      default:
        return [{ name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-light-400 dark:border-dark-800 bg-light-50 dark:bg-dark-900 transition-all duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header on mobile */}
          <div className="flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-800 lg:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-dark-900 dark:text-dark-50 text-sm">RentalProof Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-dark-400 hover:bg-light-200 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 interactive"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
              Workspace Navigation
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group interactive ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/30 shadow-emerald-glow'
                        : 'text-dark-600 dark:text-dark-300 hover:bg-light-200/80 dark:hover:bg-dark-800/80 hover:text-dark-900 dark:hover:text-dark-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive
                            ? 'text-brand-600 dark:text-brand-400 scale-105'
                            : 'text-dark-400 group-hover:text-dark-700 dark:group-hover:text-dark-200'
                        }`}
                      />
                      <span>{link.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Card for Trust / Notice */}
          <div className="mt-auto p-4 m-3 rounded-2xl bg-dark-950 text-white text-xs border border-dark-800 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 font-bold text-brand-400 mb-1.5 relative z-10">
              <ShieldCheck className="w-4 h-4 shrink-0 text-brand-400" />
              <span>Tamper-Proof Ledger</span>
            </div>
            <p className="text-[11px] text-dark-300 leading-relaxed relative z-10">
              Every inspection photo and payment record is digitally stamped to eliminate deposit disputes.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
