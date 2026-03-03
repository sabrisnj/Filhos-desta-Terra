import React from 'react';
import { motion } from 'motion/react';
import { Heart, Leaf, Shield, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-10 pb-10">
      <header className="text-center space-y-4 py-6">
        <h2 className="text-4xl font-serif font-bold text-forest">Nossa História</h2>
        <div className="w-20 h-1 bg-terracotta mx-auto rounded-full"></div>
      </header>

      <section className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-lg bg-forest/10 h-64 flex items-center justify-center">
          <Leaf size={80} className="text-forest opacity-20" />
        </div>
        <div className="space-y-4 text-forest/80 leading-relaxed font-serif text-lg">
          <p>
            A Aldeia Filhos Desta Terra nasceu do sonho de preservar e compartilhar as tradições ancestrais 
            que nos conectam com a natureza e com nossa própria essência.
          </p>
          <p>
            Localizada em um refúgio de mata preservada, somos um centro de vivências culturais e espirituais 
            dedicado ao estudo das ervas, rituais sagrados e o modo de vida em harmonia com os ciclos da terra.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValueCard 
          icon={<Leaf className="text-emerald-600" />} 
          title="Missão" 
          text="Promover a reconexão do ser humano com a natureza através de vivências autênticas e saberes ancestrais."
        />
        <ValueCard 
          icon={<Heart className="text-red-500" />} 
          title="Valores" 
          text="Respeito à ancestralidade, preservação ambiental, acolhimento comunitário e transparência espiritual."
        />
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-forest border-b border-forest/10 pb-2">Orientações Importantes</h3>
        <div className="bg-natural-white p-8 rounded-3xl shadow-sm border border-forest/5 space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-sand rounded-full flex items-center justify-center shrink-0">
              <Shield className="text-forest" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-forest">Segurança e Respeito</h4>
              <p className="text-sm text-forest/70">Mantenha-se nas trilhas sinalizadas e respeite o silêncio durante os rituais.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-sand rounded-full flex items-center justify-center shrink-0">
              <Users className="text-forest" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-forest">Vivência Comunitária</h4>
              <p className="text-sm text-forest/70">Nossas refeições são coletivas e preparadas com ingredientes locais e orgânicos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <details className="group bg-natural-white rounded-3xl overflow-hidden shadow-sm border border-forest/5">
          <summary className="flex items-center justify-between p-6 cursor-pointer font-serif font-bold text-2xl text-forest list-none">
            <span>Nossos Espaços</span>
            <Leaf size={24} className="text-terracotta group-open:rotate-90 transition-transform" />
          </summary>
          <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-forest/5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div 
                key={i}
                className="w-full aspect-square bg-sand/40 rounded-2xl flex items-center justify-center border border-forest/5 shadow-sm"
              >
                <Leaf size={24} className="text-forest/20" />
              </div>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-3">
      <div className="p-3 bg-sand w-fit rounded-2xl">
        {icon}
      </div>
      <h4 className="text-xl font-serif font-bold text-forest">{title}</h4>
      <p className="text-sm text-forest/70 leading-relaxed">{text}</p>
    </div>
  );
}
