export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  price: number;
  capacity: number;
  program: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  published: number;
  image_seed: string;
}

export interface Visit {
  id: number;
  name: string;
  phone: string;
  email: string;
  visit_date: string;
  people_count: number;
  visit_type: 'individual' | 'grupo' | 'escolar';
  category: 'vivencia_indigena' | 'oficina' | 'ritual' | 'festival' | 'formacao';
  food: 'com_almoco' | 'sem_almoco' | 'com_almoco_bebida';
  period: 'manha' | 'tarde' | 'integral';
  observations: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'missed';
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}
