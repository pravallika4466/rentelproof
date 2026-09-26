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
        ];
      case 'service_provider':
        return [
          { name: 'Technician Dashboard', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Work Orders', to: '/maintenance', icon: Wrench },
          { name: 'Work Documents', to: '/documents', icon: FileText },
          { name: 'My Profile', to: '/profile', icon: UserCheck },
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
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200/90 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header on mobile */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-900 text-sm">RentalProof Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
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
          <div className="mt-auto p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-zinc-950 text-white text-xs border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Tamper-Proof Ledger</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Every inspection photo and payment record is digitally stamped to eliminate deposit disputes.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
