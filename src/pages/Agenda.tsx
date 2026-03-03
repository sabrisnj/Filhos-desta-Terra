import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday, lastDayOfMonth, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Users, Clock, Utensils, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Visit } from '../types';

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupQuery, setLookupQuery] = useState('');
  const [myVisits, setMyVisits] = useState<Visit[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    people_count: '1',
    visit_type: 'individual',
    category: 'vivencia_indigena',
    food: 'sem_almoco',
    period: 'manha',
    observations: '',
    agreed: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleLookup = async () => {
    if (!lookupQuery) return;
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/visits/lookup?query=${encodeURIComponent(lookupQuery)}`);
      const data = await res.json();
      setMyVisits(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    if (!formData.agreed) {
      setError("Você precisa aceitar as regras da Aldeia.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          visit_date: format(selectedDate, 'yyyy-MM-dd')
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao realizar agendamento');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center text-sand">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-forest">Agendamento Realizado!</h2>
          <p className="text-forest/70">Enviamos uma confirmação para seu e-mail e WhatsApp.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-forest text-sand px-8 py-3 rounded-full font-bold shadow-lg"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-forest">Agendar Visita</h2>
        <p className="text-forest/60">Escolha uma data e preencha seus dados para vivenciar a Aldeia.</p>
        <div className="bg-terracotta/10 text-terracotta p-3 rounded-xl text-xs font-bold border border-terracotta/20">
          ⚠️ VISITAS SOMENTE MEDIANTE A AGENDAMENTO. 
          As vivências ocorrem apenas no último final de semana de cada mês.
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              step >= i ? "bg-terracotta" : "bg-forest/10"
            )} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-4">
              <h3 className="font-serif font-bold text-xl flex items-center gap-2">
                <Info size={20} className="text-terracotta" />
                Filtros da Experiência
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField 
                  label="Tipo de Visita" 
                  name="visit_type" 
                  value={formData.visit_type} 
                  onChange={handleInputChange}
                  options={[
                    { value: 'individual', label: 'Individual' },
                    { value: 'grupo', label: 'Grupo' },
                    { value: 'escolar', label: 'Escolar' }
                  ]}
                />
                <SelectField 
                  label="Categoria" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  options={[
                    { value: 'vivencia_indigena', label: 'Vivência Indígena' },
                    { value: 'vivencia_gratuita', label: 'Vivência Gratuita' },
                    { value: 'oficina', label: 'Oficina' },
                    { value: 'ritual', label: 'Ritual' },
                    { value: 'festival', label: 'Festival' },
                    { value: 'formacao', label: 'Formação' }
                  ]}
                />
                <SelectField 
                  label="Alimentação" 
                  name="food" 
                  value={formData.food} 
                  onChange={handleInputChange}
                  options={[
                    { value: 'sem_almoco', label: 'Sem Almoço' },
                    { value: 'com_almoco', label: 'Com Almoço' },
                    { value: 'com_almoco_bebida', label: 'Com Almoço + Bebida' }
                  ]}
                />
                <SelectField 
                  label="Período" 
                  name="period" 
                  value={formData.period} 
                  onChange={handleInputChange}
                  options={[
                    { value: 'manha', label: 'Manhã' },
                    { value: 'tarde', label: 'Tarde' },
                    { value: 'integral', label: 'Integral' }
                  ]}
                />
              </div>
            </section>

            <section className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-xl">Calendário</h3>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-sand rounded-full">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-sand rounded-full">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <p className="text-center font-serif font-bold text-forest capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </p>
              
              <div className="grid grid-cols-7 gap-1">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-forest/40 py-2">{d}</div>
                ))}
                {renderCalendarDays(currentDate, selectedDate, setSelectedDate)}
              </div>

              <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider pt-4 border-t border-forest/5">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Disponível</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Poucas Vagas</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Lotado</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Bloqueado / Indisponível</div>
              </div>
            </section>

            <button 
              disabled={!selectedDate}
              onClick={() => setStep(2)}
              className="w-full bg-forest text-sand py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              PRÓXIMO PASSO
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-4">
              <h3 className="font-serif font-bold text-xl">Dados do Visitante</h3>
              <div className="space-y-4">
                <InputField label="Nome Completo" name="name" value={formData.name} onChange={handleInputChange} placeholder="Seu nome" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Telefone / WhatsApp" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" required />
                  <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="seu@email.com" required />
                </div>
                <InputField label="Número de Pessoas" name="people_count" type="number" min="1" value={formData.people_count} onChange={handleInputChange} required />
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-forest/60">Observações</label>
                  <textarea 
                    name="observations"
                    value={formData.observations}
                    onChange={handleInputChange}
                    className="w-full bg-sand/50 border border-forest/10 rounded-xl p-3 focus:outline-none focus:border-terracotta min-h-[100px]"
                    placeholder="Alguma necessidade especial ou comentário?"
                  />
                </div>
              </div>
            </section>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-forest/10 text-forest py-4 rounded-2xl font-bold">VOLTAR</button>
              <button 
                disabled={!formData.name || !formData.phone || !formData.email}
                onClick={() => setStep(3)}
                className="flex-[2] bg-forest text-sand py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50"
              >
                PRÓXIMO PASSO
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 space-y-4">
              <h3 className="font-serif font-bold text-xl">Regras da Aldeia</h3>
              <div className="space-y-3 text-sm text-forest/80 leading-relaxed">
                <p>• <strong>Respeito às tradições:</strong> A Aldeia é um espaço sagrado. Respeite os rituais e orientações dos anciãos.</p>
                <p>• <strong>Pontualidade:</strong> Chegue com 15 minutos de antecedência.</p>
                <p>• <strong>Preservação ambiental:</strong> Não deixe lixo e não retire plantas da mata.</p>
                <p>• <strong>Uso de imagem:</strong> Fotos são permitidas apenas em áreas autorizadas.</p>
                <p>• <strong>Cancelamento:</strong> Avise com pelo menos 48h de antecedência.</p>
              </div>
              <label className="flex items-start gap-3 pt-4 border-t border-forest/5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 rounded border-forest/20 text-terracotta focus:ring-terracotta" 
                />
                <span className="text-sm font-medium group-hover:text-terracotta transition-colors">
                  Declaro que li e aceito as regras da Aldeia Filhos Desta Terra.
                </span>
              </label>
            </section>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-forest/10 text-forest py-4 rounded-2xl font-bold">VOLTAR</button>
              <button 
                onClick={handleSubmit}
                disabled={loading || !formData.agreed}
                className="flex-[2] bg-terracotta text-sand py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "PROCESSANDO..." : "CONFIRMAR AGENDAMENTO"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Bookings Section */}
      <section className="pt-10 border-t border-forest/10 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-serif font-bold text-forest">Meus Agendamentos</h3>
          <p className="text-sm text-forest/60">Consulte o status de suas visitas anteriores ou futuras.</p>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="E-mail ou Telefone"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            className="flex-1 bg-natural-white border border-forest/10 rounded-xl p-4 focus:outline-none focus:border-terracotta shadow-sm"
          />
          <button 
            onClick={handleLookup}
            disabled={lookupLoading}
            className="bg-forest text-sand px-6 py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
          >
            {lookupLoading ? "..." : "BUSCAR"}
          </button>
        </div>

        <div className="space-y-4">
          {myVisits.length > 0 ? (
            myVisits.map(visit => (
              <div key={visit.id} className="bg-natural-white p-6 rounded-3xl shadow-sm border border-forest/5 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-forest/40">
                    {format(new Date(visit.visit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="font-serif font-bold text-forest">{visit.category}</p>
                  <p className="text-xs text-forest/60">{visit.people_count} pessoas • {visit.period}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={visit.status} />
                </div>
              </div>
            ))
          ) : lookupQuery && !lookupLoading && (
            <p className="text-center text-forest/40 italic py-4">Nenhum agendamento encontrado.</p>
          )}
        </div>
      </section>
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

function renderCalendarDays(currentDate: Date, selectedDate: Date | null, onSelect: (d: Date) => void) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Calculate last weekend of the month
  const lastDay = lastDayOfMonth(currentDate);
  let lastSaturday = lastDay;
  while (lastSaturday.getDay() !== 6) {
    lastSaturday = subDays(lastSaturday, 1);
  }
  const lastSunday = addDays(lastSaturday, 1);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    const cloneDay = day;
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, monthStart);
    const isPast = isBefore(day, startOfToday());
    
    // Availability logic: Only last weekend of the month
    const isLastWeekend = isSameDay(day, lastSaturday) || isSameDay(day, lastSunday);
    const isAvailable = isLastWeekend && !isPast && isCurrentMonth;

    const status = !isAvailable ? 'blocked' : 'available';

    days.push(
      <button
        key={day.toString()}
        disabled={!isAvailable}
        onClick={() => onSelect(cloneDay)}
        className={cn(
          "h-12 w-full rounded-xl flex flex-col items-center justify-center relative transition-all",
          !isCurrentMonth && "opacity-20",
          isSelected ? "bg-forest text-sand shadow-md scale-105 z-10" : "hover:bg-sand",
          isToday && !isSelected && "border border-terracotta text-terracotta",
          !isAvailable && "cursor-not-allowed opacity-30 bg-gray-100/50"
        )}
      >
        <span className="text-sm font-bold">{format(day, 'd')}</span>
        {isCurrentMonth && !isPast && (
          <div className={cn(
            "w-1.5 h-1.5 rounded-full mt-1",
            status === 'available' && "bg-emerald-500",
            status === 'blocked' && "bg-gray-300"
          )} />
        )}
      </button>
    );
    day = addDays(day, 1);
  }
  return days;
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-forest/60">{label}</label>
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-sand/50 border border-forest/10 rounded-xl p-3 focus:outline-none focus:border-terracotta appearance-none"
      >
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-forest/60">{label}</label>
      <input 
        {...props}
        className="w-full bg-sand/50 border border-forest/10 rounded-xl p-3 focus:outline-none focus:border-terracotta"
      />
    </div>
  );
}
