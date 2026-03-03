import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, Star, Info, Phone, Instagram, MessageCircle, Lock, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-0">
      <header className="bg-forest text-sand p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-sand/20">
            <Leaf size={24} className="text-forest" />
          </div>
          <h1 className="text-lg font-serif font-bold tracking-wide">Aldeia Filhos Desta Terra</h1>
        </NavLink>
        <div className="hidden md:flex items-center gap-6">
          <HeaderNavItem to="/" label="Início" />
          <HeaderNavItem to="/agenda" label="Agenda" />
          <HeaderNavItem to="/historias" label="Histórias" />
          <HeaderNavItem to="/sobre" label="Sobre" />
          <HeaderNavItem to="/contato" label="Contato" />
          <NavLink to="/admin" className="bg-sand text-forest px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors">
            ADMIN
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Outlet />
      </main>

      {/* Footer / Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-natural-white border-t border-forest/10 px-4 py-3 flex justify-between items-center z-50 md:hidden overflow-x-auto no-scrollbar">
        <NavItem to="/" icon={<Home size={20} />} label="Início" />
        <NavItem to="/agenda" icon={<Calendar size={20} />} label="Agenda" />
        <NavItem to="/historias" icon={<Star size={20} />} label="Histórias" />
        <NavItem to="/sobre" icon={<Info size={20} />} label="Sobre" />
        <NavItem to="/contato" icon={<Phone size={20} />} label="Contato" />
        <NavItem to="/admin" icon={<Lock size={20} />} label="Admin" />
      </nav>
    </div>
  );
}

function HeaderNavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "text-sm font-bold uppercase tracking-wider transition-colors",
        isActive ? "text-sand" : "text-sand/60 hover:text-sand"
      )}
    >
      {label}
    </NavLink>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex flex-col items-center gap-1 transition-colors",
        isActive ? "text-terracotta" : "text-forest/60"
      )}
    >
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
    </NavLink>
  );
}
