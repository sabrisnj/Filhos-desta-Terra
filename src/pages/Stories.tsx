import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Story } from '../types';
import { BookOpen, ChevronDown } from 'lucide-react';

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stories?published=true')
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-forest">Nossas Histórias</h2>
        <p className="text-forest/60">Conheça a ancestralidade e as tradições dos povos que habitam esta terra.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-forest/40 font-serif italic">Carregando histórias...</div>
        ) : stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <details className="group bg-natural-white rounded-3xl overflow-hidden shadow-sm border border-forest/5">
              <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer list-none">
                <div className="flex items-center gap-4 text-terracotta">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-sand rounded-2xl flex items-center justify-center text-terracotta shadow-inner shrink-0">
                    <BookOpen size={20} className="md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-forest">{story.title}</h3>
                </div>
                <ChevronDown size={24} className="text-forest/30 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="p-6 md:p-8 pt-0 border-t border-forest/5">
                <p className="text-forest/70 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {story.content}
                </p>
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
