import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Plus, Trash2, Check, X, Download, Filter, Search, BookOpen, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Event, Visit, Setting, Story } from '../types';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visits' | 'events' | 'stories' | 'settings'>('dashboard');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);

  // New Story Form State
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    content: '',
    published: true,
    image_seed: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Filhos@2026') {
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert('Senha incorreta');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, eRes, sRes, stRes] = await Promise.all([
        fetch('/api/visits'),
        fetch('/api/events'),
        fetch('/api/settings'),
        fetch('/api/stories')
      ]);
      const [vData, eData, sData, stData] = await Promise.all([vRes.json(), eRes.json(), sRes.json(), stRes.json()]);
      setVisits(vData);
      setEvents(eData);
      setSettings(sData);
      setStories(stData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateVisitStatus = async (id: number, status: string) => {
    await fetch(`/api/visits/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const deleteEvent = async (id: number) => {
    if (confirm('Deseja excluir este evento?')) {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingStory ? 'PATCH' : 'POST';
    const url = editingStory ? `/api/stories/${editingStory.id}` : '/api/stories';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyForm)
    });
    
    setShowStoryForm(false);
    setEditingStory(null);
    setStoryForm({ title: '', content: '', published: true, image_seed: '' });
    fetchData();
  };

  const deleteStory = async (id: number) => {
    if (confirm('Deseja excluir esta história?')) {
      await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const openEditStory = (story: Story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title,
      content: story.content,
      published: story.published === 1,
      image_seed: story.image_seed
    });
    setShowStoryForm(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-sand p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-forest rounded-full mx-auto flex items-center justify-center text-sand text-2xl font-serif font-bold">A</div>
            <h2 className="text-2xl font-serif font-bold text-forest">Painel Administrativo</h2>
            <p className="text-forest/60 text-sm">Acesso restrito aos guardiões da Aldeia.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-forest/60">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-natural-white border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-forest text-sand py-4 rounded-xl font-bold shadow-lg hover:bg-forest/90 transition-colors">
              ENTRAR NO PAINEL
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-forest text-sand p-6 flex flex-col gap-8 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center text-sand font-serif font-bold">A</div>
          <h1 className="font-serif font-bold text-lg leading-tight">Painel Aldeia</h1>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <AdminNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <AdminNavItem active={activeTab === 'visits'} onClick={() => setActiveTab('visits')} icon={<Users size={20} />} label="Visitantes" />
          <AdminNavItem active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={20} />} label="Eventos" />
          <AdminNavItem active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} icon={<BookOpen size={20} />} label="Histórias" />
          <AdminNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Configurações" />
        </nav>

        <button 
          onClick={() => {
            setIsLoggedIn(false);
            window.location.href = '/';
          }} 
          className="flex items-center gap-3 text-sand/60 hover:text-sand transition-colors mt-auto pt-6 border-t border-sand/10"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-end border-b border-forest/10 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif font-bold text-forest capitalize">{activeTab}</h2>
            <p className="text-forest/60 text-sm">Bem-vindo ao controle da Aldeia Filhos Desta Terra.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-3 bg-natural-white border border-forest/10 rounded-xl hover:bg-sand transition-colors">
              <Download size={20} className="text-forest/60" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total de Visitas" value={visits.length} color="bg-natural-white" />
              <StatCard title="Eventos Ativos" value={events.length} color="bg-natural-white" />
              <StatCard title="Histórias" value={stories.length} color="bg-natural-white" />
              
              <div className="md:col-span-3 bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5">
                <h3 className="font-serif font-bold text-xl mb-4">Próximas Visitas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold uppercase text-forest/40 border-b border-forest/5">
                        <th className="pb-4">Data</th>
                        <th className="pb-4">Nome</th>
                        <th className="pb-4">Pessoas</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {visits.slice(0, 5).map(v => (
                        <tr key={v.id} className="border-b border-forest/5">
                          <td className="py-4 font-medium">{new Date(v.visit_date).toLocaleDateString('pt-BR')}</td>
                          <td className="py-4">{v.name}</td>
                          <td className="py-4">{v.people_count}</td>
                          <td className="py-4">
                            <StatusBadge status={v.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'visits' && (
            <motion.div key="visits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" size={18} />
                  <input type="text" placeholder="Buscar por nome ou e-mail..." className="w-full bg-natural-white border border-forest/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-terracotta" />
                </div>
                <button className="px-6 py-3 bg-natural-white border border-forest/10 rounded-xl flex items-center gap-2 font-bold text-sm text-forest/60">
                  <Filter size={18} />
                  Filtros
                </button>
              </div>

              <div className="bg-natural-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold uppercase text-forest/40 bg-sand/30">
                        <th className="p-6">Visitante</th>
                        <th className="p-6">Data</th>
                        <th className="p-6">Detalhes</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {visits.map(v => (
                        <tr key={v.id} className="border-b border-forest/5 hover:bg-sand/10 transition-colors">
                          <td className="p-6">
                            <div className="font-bold text-forest">{v.name}</div>
                            <div className="text-xs text-forest/40">{v.phone}</div>
                          </td>
                          <td className="p-6">
                            <div className="font-medium">{new Date(v.visit_date).toLocaleDateString('pt-BR')}</div>
                            <div className="text-xs text-forest/40 capitalize">{v.period}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-xs font-medium">{v.people_count} pessoas</div>
                            <div className="text-xs text-forest/40 capitalize">{v.category}</div>
                          </td>
                          <td className="p-6">
                            <StatusBadge status={v.status} />
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              {v.status === 'pending' && (
                                <>
                                  <button onClick={() => updateVisitStatus(v.id, 'confirmed')} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                                    <Check size={16} />
                                  </button>
                                  <button onClick={() => updateVisitStatus(v.id, 'cancelled')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              {v.status === 'confirmed' && (
                                <button onClick={() => updateVisitStatus(v.id, 'attended')} className="px-3 py-1 bg-forest text-sand text-xs font-bold rounded-lg">
                                  Compareceu
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-end">
                <button className="bg-terracotta text-sand px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                  <Plus size={20} />
                  CRIAR NOVO EVENTO
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(e => (
                  <div key={e.id} className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 flex gap-4">
                    <div className="w-16 h-16 bg-sand rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar size={24} className="text-forest/40" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-lg text-forest">{e.title}</h4>
                        <button onClick={() => deleteEvent(e.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold uppercase text-forest/40">
                        <span>{new Date(e.date).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>{e.category}</span>
                      </div>
                      <div className="text-xs text-forest/70 line-clamp-2">{e.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stories' && (
            <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    setEditingStory(null);
                    setStoryForm({ title: '', content: '', published: true, image_seed: '' });
                    setShowStoryForm(true);
                  }}
                  className="bg-terracotta text-sand px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                  <Plus size={20} />
                  CRIAR NOVA HISTÓRIA
                </button>
              </div>

              {showStoryForm && (
                <div className="fixed inset-0 bg-forest/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-sand p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-forest">{editingStory ? 'Editar História' : 'Nova História'}</h3>
                    <form onSubmit={handleStorySubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-forest/60">Título (Povo)</label>
                        <input 
                          type="text" 
                          value={storyForm.title}
                          onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                          className="w-full bg-natural-white border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta"
                          placeholder="Ex: Pankararu"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-forest/60">Conteúdo / História</label>
                        <textarea 
                          value={storyForm.content}
                          onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                          className="w-full bg-natural-white border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta min-h-[200px]"
                          placeholder="Conte a história deste povo..."
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase text-forest/60">Semente da Imagem (Seed)</label>
                          <input 
                            type="text" 
                            value={storyForm.image_seed}
                            onChange={(e) => setStoryForm({ ...storyForm, image_seed: e.target.value })}
                            className="w-full bg-natural-white border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta"
                            placeholder="Ex: pankararu"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                          <input 
                            type="checkbox" 
                            checked={storyForm.published}
                            onChange={(e) => setStoryForm({ ...storyForm, published: e.target.checked })}
                            className="w-5 h-5 rounded border-forest/20 text-terracotta focus:ring-terracotta"
                          />
                          <label className="text-sm font-bold text-forest">Publicar no Site</label>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowStoryForm(false)} className="flex-1 bg-forest/10 text-forest py-4 rounded-xl font-bold">CANCELAR</button>
                        <button type="submit" className="flex-1 bg-forest text-sand py-4 rounded-xl font-bold shadow-lg">PUBLICAR</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map(s => (
                  <div key={s.id} className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-sand rounded-lg">
                          <BookOpen size={20} className="text-terracotta" />
                        </div>
                        <h4 className="font-serif font-bold text-lg text-forest">{s.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditStory(s)} className="p-2 text-forest/40 hover:text-forest transition-colors">
                          <Settings size={18} />
                        </button>
                        <button onClick={() => deleteStory(s.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-forest/70 line-clamp-3 whitespace-pre-wrap">{s.content}</div>
                    <div className="flex justify-between items-center pt-4 border-t border-forest/5">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                        {s.published === 1 ? (
                          <span className="flex items-center gap-1 text-emerald-500"><Eye size={12} /> Publicado</span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400"><EyeOff size={12} /> Rascunho</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl space-y-8">
              <section className="bg-natural-white p-8 rounded-3xl shadow-sm border border-forest/5 space-y-6">
                <h3 className="text-xl font-serif font-bold text-forest">Capacidade Diária por Atividade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'capacity_vivencia_indigena', label: 'Vivência Indígena' },
                    { key: 'capacity_vivencia_gratuita', label: 'Vivência Gratuita' },
                    { key: 'capacity_oficina', label: 'Oficina' },
                    { key: 'capacity_ritual', label: 'Ritual' },
                    { key: 'capacity_festival', label: 'Festival' },
                    { key: 'capacity_formacao', label: 'Formação' }
                  ].map((item) => (
                    <div key={item.key} className="space-y-1">
                      <label className="text-xs font-bold uppercase text-forest/60">{item.label}</label>
                      <input 
                        type="number" 
                        defaultValue={settings.find(s => s.key === item.key)?.value || '20'}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          try {
                            await fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ key: item.key, value: val })
                            });
                            // Update local state
                            setSettings(prev => {
                              const existing = prev.find(s => s.key === item.key);
                              if (existing) {
                                return prev.map(s => s.key === item.key ? { ...s, value: val } : s);
                              }
                              return [...prev, { key: item.key, value: val }];
                            });
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="w-full bg-sand/50 border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-natural-white p-8 rounded-3xl shadow-sm border border-forest/5 space-y-6">
                <h3 className="text-xl font-serif font-bold text-forest">Geral</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-forest/60">Capacidade Diária Total (Backup)</label>
                    <input 
                      type="number" 
                      defaultValue={settings.find(s => s.key === 'daily_capacity')?.value || '20'}
                      onBlur={async (e) => {
                        const val = e.target.value;
                        try {
                          await fetch('/api/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'daily_capacity', value: val })
                          });
                          setSettings(prev => {
                            const existing = prev.find(s => s.key === 'daily_capacity');
                            if (existing) {
                              return prev.map(s => s.key === 'daily_capacity' ? { ...s, value: val } : s);
                            }
                            return [...prev, { key: 'daily_capacity', value: val }];
                          });
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="w-full bg-sand/50 border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-forest/60">E-mail de Notificação</label>
                    <input 
                      type="email" 
                      defaultValue="contato@aldeia.com"
                      className="w-full bg-sand/50 border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AdminNavItem({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
        active ? "bg-terracotta text-sand shadow-lg" : "text-sand/60 hover:text-sand hover:bg-sand/5"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <div className={cn("p-6 rounded-3xl shadow-sm border border-forest/5", color)}>
      <p className="text-xs font-bold uppercase text-forest/40 mb-1">{title}</p>
      <p className="text-4xl font-serif font-bold text-forest">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-amber-100 text-amber-600",
    confirmed: "bg-emerald-100 text-emerald-600",
    cancelled: "bg-red-100 text-red-600",
    attended: "bg-forest text-sand",
    missed: "bg-gray-100 text-gray-400"
  };
  
  const labels: any = {
    pending: "Pendente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    attended: "Compareceu",
    missed: "Faltou"
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", styles[status])}>
      {labels[status]}
    </span>
  );
}
