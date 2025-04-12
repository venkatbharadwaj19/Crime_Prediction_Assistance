import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, History, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { icon: <Home size={20} />, text: 'Dashboard', path: '/' },
    { icon: <PlusCircle size={20} />, text: 'New Case', path: '/new-case' },
    { icon: <History size={20} />, text: 'Case History', path: '/case-history' },
    { icon: <Settings size={20} />, text: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-navy-850 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Crime Investigation</h1>
        <p className="text-sm text-slate-400">AI Assistant</p>
      </div>
      
      <nav className="space-y-2">
        {links.map((link) => (
          <SidebarLink
            key={link.path}
            icon={link.icon}
            text={link.text}
            active={location.pathname === link.path}
            onClick={() => navigate(link.path)}
          />
        ))}
      </nav>
      
      <div className="absolute bottom-8 left-6">
        <button className="flex items-center text-slate-400 hover:text-white transition-colors">
          <LogOut size={20} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, text, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-400 hover:bg-navy-750 hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </button>
  );
};

export default Sidebar;