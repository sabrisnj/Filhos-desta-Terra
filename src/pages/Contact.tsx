import React from 'react';
import { MessageCircle, Instagram, Mail, MapPin, Navigation, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="space-y-10 pb-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-forest">Fale Conosco</h2>
        <p className="text-forest/60">Estamos aqui para tirar suas dúvidas e acolher sua visita.</p>
      </header>

      <section className="grid grid-cols-1 gap-4">
        <ContactButton 
          href="https://wa.me/5511982554605"
          icon={<MessageCircle className="text-emerald-500" />}
          title="WhatsApp"
          subtitle="Resposta rápida em horário comercial"
        />
        <ContactButton 
          href="https://www.instagram.com/aldeiafilhosdestaterra"
          icon={<Instagram className="text-pink-500" />}
          title="Instagram"
          subtitle="@aldeiafilhosdestaterra"
        />
        <ContactButton 
          href="mailto:contato@aldeia.com"
          icon={<Mail className="text-blue-500" />}
          title="E-mail"
          subtitle="contato@aldeia.com"
        />
      </section>

      <section className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-6">
        <h3 className="text-xl font-serif font-bold text-forest">Como Chegar</h3>
        <div className="aspect-video rounded-2xl overflow-hidden bg-sand/50 relative group flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-natural-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <MapPin className="text-terracotta" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase text-forest/40">Localização</p>
                <p className="text-sm font-bold text-forest">Av. Benjamin Harris Hunicutt, 4112</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full bg-forest text-sand py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
          <Navigation size={20} />
          ABRIR NO GPS (GOOGLE MAPS)
        </button>
        <p className="text-xs text-center text-forest/40 italic">
          * Recomendamos o uso de veículos 4x4 em dias de chuva forte.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-forest">Envie uma Mensagem</h3>
        <form className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-forest/60">Assunto</label>
            <input type="text" className="w-full bg-sand/50 border border-forest/10 rounded-xl p-3 focus:outline-none focus:border-terracotta" placeholder="Ex: Dúvida sobre vivência" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-forest/60">Mensagem</label>
            <textarea className="w-full bg-sand/50 border border-forest/10 rounded-xl p-3 focus:outline-none focus:border-terracotta min-h-[120px]" placeholder="Escreva aqui sua mensagem..." />
          </div>
          <button className="w-full bg-terracotta text-sand py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
            <Send size={20} />
            ENVIAR MENSAGEM
          </button>
        </form>
      </section>
    </div>
  );
}

function ContactButton({ href, icon, title, subtitle }: { href: string; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="bg-natural-white p-4 rounded-2xl shadow-sm border border-forest/5 flex items-center gap-4 hover:border-terracotta transition-colors group"
    >
      <div className="p-3 bg-sand rounded-xl group-hover:bg-terracotta/10 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-forest">{title}</h4>
        <p className="text-xs text-forest/60">{subtitle}</p>
      </div>
    </a>
  );
}
