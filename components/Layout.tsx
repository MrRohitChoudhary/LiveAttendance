
import React from 'react';
import { User, LogOut, MapPin, ClipboardList, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onLogout: () => void;
  activeTab: 'attendance' | 'history' | 'admin';
  setActiveTab: (tab: 'attendance' | 'history' | 'admin') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="font-bold text-lg tracking-tight">GeoTrust</h1>
        </div>
        <button onClick={onLogout} className="p-2 hover:bg-indigo-500 rounded-full transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        <div className="mb-6">
          <p className="text-slate-500 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
            {user.role.toUpperCase()}
          </span>
        </div>
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around max-w-md mx-auto z-20">
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'attendance' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <MapPin className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Attendance</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'history' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <ClipboardList className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </button>
        {user.role === 'admin' && (
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'admin' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
          >
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-1">Admin</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default Layout;
