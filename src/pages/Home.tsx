import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Star, Info, Phone, ArrowRight, Instagram, MessageCircle, Tent, Leaf } from 'lucide-react';
import { Event } from '../types';
import { cn } from '../lib/utils';

export default function Home() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setNextEvent(data[0]);
        }
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center overflow-hidden shadow-xl border-4 border-terracotta/20"
        >
          <Leaf size={60} className="text-forest" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-3xl font-serif font-bold text-forest">Aldeia Filhos Desta Terra</h2>
          <p className="text-terracotta italic font-serif text-lg leading-relaxed px-4">
            "reserva onde vivem os povos Pankararu, Pankararé, Guajajara, Tupi e Timbira 🏹 🌿"
          </p>
          <div className="bg-terracotta/10 text-terracotta px-4 py-2 rounded-full inline-block text-xs font-bold uppercase tracking-widest border border-terracotta/20">
            VISITAS SOMENTE MEDIANTE A AGENDAMENTO
          </div>
        </div>
      </section>

      {/* Next Event Banner */}
      {nextEvent && (
        <motion.section 
          whileHover={{ y: -5 }}
          className="relative overflow-hidden rounded-3xl bg-forest text-sand p-6 shadow-lg group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="bg-terracotta text-[10px] uppercase font-bold px-3 py-1 rounded-full">Próximo Evento</span>
            <h3 className="text-2xl font-serif font-bold">{nextEvent.title}</h3>
            <p className="text-sand/80 line-clamp-2">{nextEvent.description}</p>
            <div className="flex justify-between items-end">
              <div className="text-sm font-medium">
                {new Date(nextEvent.date).toLocaleDateString('pt-BR')} às {nextEvent.time}
              </div>
              <Link 
                to="/eventos" 
                className="flex items-center gap-2 text-terracotta font-bold hover:underline"
              >
                Ver detalhes <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 gap-4">
        <QuickAction 
          to="/agenda" 
          icon={<Calendar className="text-terracotta" />} 
          title="Agendar Visita" 
          color="bg-natural-white"
        />
        <QuickAction 
          to="/historias" 
          icon={<Star className="text-forest" />} 
          title="Nossas Histórias" 
          color="bg-natural-white"
        />
        <QuickAction 
          to="/sobre" 
          icon={<Info className="text-forest" />} 
          title="Sobre a Aldeia" 
          color="bg-natural-white"
        />
        <QuickAction 
          to="/contato" 
          icon={<Phone className="text-terracotta" />} 
          title="Contato" 
          color="bg-natural-white"
        />
      </section>

      {/* Featured Experience */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif font-bold border-b border-forest/10 pb-2">Vivência em Destaque</h3>
        <div className="rounded-3xl overflow-hidden bg-natural-white shadow-sm border border-forest/5">
          <div className="w-full h-48 bg-forest/10 flex items-center justify-center">
            <div className="p-6 bg-forest/20 rounded-full">
              <Tent size={64} className="text-forest" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h4 className="text-2xl font-serif font-bold text-forest">Vivência Indígena</h4>
            
            <details className="group bg-sand/50 rounded-2xl overflow-hidden border border-forest/5">
              <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-terracotta list-none">
                <span>🌿 Programação de Vivência 2026</span>
                <ArrowRight size={18} className="group-open:rotate-90 transition-transform" />
              </summary>
              <div className="p-4 pt-0 text-sm text-forest/80 space-y-4 whitespace-pre-wrap font-sans border-t border-forest/5">
                <p>Aldeia Multiétnica Filhos Desta Terra</p>
                <p className="italic">Aberto ao público a partir das 9h</p>
                
                <div className="space-y-2">
                  <p className="font-bold border-b border-forest/10 pb-1">🌞 Manhã</p>
                  <p><strong>10h — Toré</strong><br/>Ritual tradicional de abertura e conexão espiritual.</p>
                  <p><strong>11h — Trilha Ecológica</strong><br/>Caminhada guiada para vivência com a natureza e saberes da terra.</p>
                  <p><strong>12h — Almoço</strong><br/>Momento de partilha e alimentação coletiva.</p>
                  <p><strong>12h30 — Pintura Corporal</strong><br/>Expressão cultural e ancestralidade através dos grafismos.</p>
                </div>

                <div className="space-y-2">
                  <p className="font-bold border-b border-forest/10 pb-1">🌿 Tarde</p>
                  <p><strong>13h — Pintura Artística</strong><br/>Atividade cultural e criativa.</p>
                  <p><strong>14h — Trilha Ecológica</strong><br/>Nova saída para visitantes do período da tarde.</p>
                  <p><strong>15h — Trilha Cultural</strong><br/>Conhecimento sobre história, tradições e costumes.</p>
                  <p><strong>16h — Arco e Flecha</strong><br/>Vivência prática com orientação.</p>
                  <p><strong>17h — Encerramento com o Toré</strong><br/>Ritual de fechamento e agradecimento.</p>
                </div>
                
                <p className="text-sm font-bold text-terracotta bg-terracotta/5 p-3 rounded-xl border border-terracotta/10">
                  Teremos também venda de comidas típicas, para você saborear durante a experiência, aceitamos como método de pagamento: dinheiro, crédito, débito e Pix.
                </p>

                <p className="text-[10px] text-forest/40">*Sujeito a alterações conforme condições climáticas</p>
              </div>
            </details>

            <Link 
              to="/agenda" 
              className="inline-block w-full text-center bg-forest text-sand px-6 py-3 rounded-full font-bold text-sm hover:bg-forest/90 transition-colors shadow-lg"
            >
              Reservar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Address Footer */}
      <section className="bg-forest text-sand p-8 rounded-3xl space-y-6 shadow-inner">
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-serif font-bold">Aldeia Multiétnica Filhos desta Terra</h3>
          <p className="text-sm text-sand/60">
            Av. Benjamin Harris Hunicutt, 4112 - Portal dos Gramados, Guarulhos - SP, 07124-000
          </p>
          <p className="text-xs font-bold text-terracotta">
            Contamos com estacionamento no local.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <a 
            href="https://www.instagram.com/aldeiafilhosdestaterra" 
            target="_blank" 
            rel="noreferrer"
            className="w-12 h-12 bg-natural-white rounded-full flex items-center justify-center text-forest shadow-lg hover:scale-110 transition-transform"
          >
            <Instagram size={24} className="text-forest" />
          </a>
          <a 
            href="https://wa.me/5511982554605" 
            target="_blank" 
            rel="noreferrer"
            className="w-12 h-12 bg-natural-white rounded-full flex items-center justify-center text-forest shadow-lg hover:scale-110 transition-transform"
          >
            <MessageCircle size={24} className="text-forest" />
          </a>
          <a 
            href="https://share.google/RGAGvPPwXMbyaSWYR" 
            target="_blank" 
            rel="noreferrer"
            className="w-12 h-12 bg-natural-white rounded-full flex items-center justify-center text-forest shadow-lg hover:scale-110 transition-transform"
          >
            <Info size={24} className="text-forest" />
          </a>
        </div>
      </section>
    </div>
  );
}

function QuickAction({ to, icon, title, color }: { to: string; icon: React.ReactNode; title: string; color: string }) {
  return (
    <Link to={to}>
      <motion.div 
        whileTap={{ scale: 0.95 }}
        className={cn("p-6 rounded-3xl flex flex-col items-center gap-3 shadow-sm border border-forest/5 text-center", color)}
      >
        <div className="p-3 bg-sand rounded-2xl">
          {icon}
        </div>
        <span className="font-serif font-bold text-forest text-sm">{title}</span>
      </motion.div>
    </Link>
  );
}
