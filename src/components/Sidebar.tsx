import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  LogOut,
  Stethoscope,
  FileText,
  BookOpen,
  Settings,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  onLogout: () => void;
  userRole: string;
}

const Sidebar = ({ onLogout, userRole }: SidebarProps) => {
  const allNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Data Pasien', path: '/patients' },
    { icon: Stethoscope, label: 'Rekam Dental Hygiene', path: '/medical-records' },
    { icon: BookOpen, label: 'Perpustakaan Edukasi', path: '/education' },
    { icon: Send, label: 'Rujukan', path: '/referrals' },
    { icon: Calendar, label: 'Jadwal & Janji', path: '/appointments' },
    { icon: BarChart3, label: 'Laporan', path: '/reports' },
    { icon: ShieldCheck, label: 'Keamanan Data', path: '/security' },
    { icon: FileText, label: 'Integrasi', path: '/integration' },
    { icon: Settings, label: 'Pengaturan Akun', path: '/settings' },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => {
    const role = userRole.toLowerCase();
    
    if (role === 'admin') return true;
    
    if (role === 'operator') {
      // Operator: semua kecuali data master, pengaturan keamanan dan laporan
      const excluded = ['/patients', '/security', '/reports'];
      return !excluded.includes(item.path);
    }
    
    if (role === 'pasien') {
      // Pasien: jadwal
      return item.path === '/appointments';
    }
    
    if (role === 'dosen pembimbing') {
      // Dosen pembimbing: semua kecuali pengaturan
      const excluded = ['/settings', '/security'];
      return !excluded.includes(item.path);
    }
    
    // Default for other roles (like guest or undefined)
    return ['/', '/education', '/appointments'].includes(item.path);
  });

  return (
    <aside className="w-64 bg-white text-slate-900 h-screen sticky top-0 flex flex-col border-r border-soft-blue-dark shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-pink rounded-xl shadow-lg shadow-primary-pink/20">
            <Stethoscope className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">
            PeriksaGigiKu
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Asuhan Kesehatan Gigi</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
              isActive 
                ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30 scale-[1.02]" 
                : "text-slate-500 hover:bg-soft-blue hover:text-primary-blue"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-primary-blue")} />
                <span className="font-bold text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-soft-blue">
        <div className="flex items-center gap-3 p-3 bg-baby-pink rounded-2xl border border-baby-pink-dark transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-xl bg-primary-pink flex items-center justify-center text-white font-black shadow-sm">
            {userRole.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-slate-800 truncate">Petugas Medis</p>
            <p className="text-[10px] text-primary-pink font-bold truncate uppercase tracking-tighter">{userRole || 'Staff'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
