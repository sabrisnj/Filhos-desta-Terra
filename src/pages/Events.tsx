import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar as CalendarIcon, MapPin, Clock, Tag, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Event } from '../types';
import { cn } from '../lib/utils';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = events;
    
    if (searchTerm) {
      result = result.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'Todos') {
      result = result.filter(e => e.category === selectedCategory);
    }
    
    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, events]);

  const categories = ['Todos', ...new Set(events.map(e => e.category))];

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-forest">Próximos Eventos</h2>
        <p className="text-forest/60">Participe de nossas vivências, oficinas e rituais.</p>
      </header>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" size={20} />
          <input 
            type="text" 
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-natural-white border border-forest/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-terracotta shadow-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-forest text-sand shadow-md" 
                  : "bg-natural-white text-forest/60 border border-forest/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 text-forest/40 font-serif italic">Carregando eventos...</div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={event.id}>
              <EventCard event={event} index={index} />
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-forest/40 font-serif italic">Nenhum evento encontrado para os filtros selecionados.</div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const navigate = useNavigate();
  const isWorkshop = event.title.includes('Oficina de Artesanato Indígena');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-natural-white rounded-3xl overflow-hidden shadow-sm border border-forest/5 group"
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <span className="bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-terracotta/20">
            {event.category}
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold text-forest">{event.title}</h3>
          <p className="text-forest/70 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
        </div>
        
        {!isWorkshop && (
          <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-forest/5">
            <div className="flex items-center gap-2 text-xs font-medium text-forest/60">
              <CalendarIcon size={14} className="text-terracotta" />
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-forest/60">
              <Clock size={14} className="text-terracotta" />
              {event.time}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-forest/60">
              <Users size={14} className="text-terracotta" />
              {event.capacity} vagas
            </div>
          </div>
        )}

        {isWorkshop && (
          <div className="pt-4 border-t border-forest/5">
            <p className="text-xs font-bold text-terracotta uppercase tracking-wider italic">
              Sem previsão de data - Acompanhe nossas redes
            </p>
          </div>
        )}
        
        <button 
          onClick={() => navigate('/agenda')}
          className="w-full bg-forest text-sand py-3 rounded-xl font-bold hover:bg-forest/90 transition-colors active:scale-95"
        >
          AGENDAR VISITA
        </button>
      </div>
    </motion.div>
  );
}
