import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'aldeia.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    category TEXT,
    price REAL,
    capacity INTEGER,
    program TEXT
  );

  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    visit_date TEXT NOT NULL,
    people_count INTEGER NOT NULL,
    visit_type TEXT,
    category TEXT,
    food TEXT,
    period TEXT,
    observations TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    published INTEGER DEFAULT 0,
    image_seed TEXT
  );

  -- Default settings
  INSERT OR IGNORE INTO settings (key, value) VALUES ('daily_capacity', '20');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('capacity_vivencia_indigena', '20');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('capacity_vivencia_gratuita', '10');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('capacity_oficina', '15');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('capacity_ritual', '30');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('capacity_festival', '100');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('capacity_formacao', '20');
`);

// Seed initial stories if empty
const storyCount = db.prepare('SELECT COUNT(*) as count FROM stories').get() as { count: number };
if (storyCount.count === 0) {
  const insertStory = db.prepare(`
    INSERT INTO stories (title, content, published, image_seed)
    VALUES (?, ?, ?, ?)
  `);
  
  const initialStories = [
    { 
      title: 'Pankararu', 
      content: 'Originários do sertão de Pernambuco, às margens do Rio São Francisco, habitam uma área com evidências de ocupação há cerca de 7.000 anos. No século XVII, foram aldeados por missionários no Brejo dos Padres. Ao longo do século XX, devido a secas severas e conflitos com fazendeiros, muitos migraram para outras regiões, formando comunidades em locais como o Tocantins e a cidade de São Paulo (na favela Real Parque).', 
      published: 1, 
      seed: 'pankararu' 
    },
    { 
      title: 'Pankararé', 
      content: 'Vivem na região do Raso da Catarina, na Bahia, uma das áreas mais secas do semiárido. Historicamente conhecidos como "cabocos do Brejo", possuem um conhecimento profundo sobre a Caatinga, dividindo seu mundo entre o Brejo (área de roça) e o Raso (área selvagem ou "bruta"). Mantêm rituais tradicionais fortes, como as danças dos Praiá e o uso ritual da jurema.', 
      published: 1, 
      seed: 'pankarare' 
    },
    { 
      title: 'Guajajara (Tenetehara)', 
      content: 'Um dos povos mais numerosos do Brasil, habitam o estado do Maranhão há mais de 380 anos de contato registrado. Sua história é marcada por ciclos de servidão em missões religiosas e episódios de resistência, como a Revolta de 1901 contra missionários capuchinhos. Atualmente, são reconhecidos pelo papel dos "Guardiões da Floresta", que combatem invasões de madeireiros em suas terras.', 
      published: 1, 
      seed: 'guajajara' 
    },
    { 
      title: 'Tupi', 
      content: 'Diferente dos outros, o termo "Tupi" refere-se a um amplo tronco linguístico e cultural que dominava quase todo o litoral brasileiro na chegada dos europeus. Originários da Amazônia, migraram para o leste em busca da "Terra Sem Males". Grupos famosos incluem os Tupinambá, Tupiniquim e Potiguara. Sua cultura influenciou profundamente o português falado no Brasil e costumes cotidianos, como o uso da rede e o banho diário.', 
      published: 1, 
      seed: 'tupi' 
    },
    { 
      title: 'Timbira', 
      content: 'Este é um conjunto de povos da família linguística Jê (como os Krahô, Canela e Apinayé) que habitam o cerrado do Maranhão e Tocantins. Com mais de 300 anos de contato, foram historicamente perseguidos por grandes fazendas de gado que avançaram sobre seus territórios. São conhecidos por sua organização social complexa, rituais de passagem e a tradicional corrida de toras.', 
      published: 1, 
      seed: 'timbira' 
    },
  ];

  for (const s of initialStories) {
    insertStory.run(s.title, s.content, s.published, s.seed);
  }
}

// Seed some initial events if empty
const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
if (eventCount.count === 0) {
  const insertEvent = db.prepare(`
    INSERT INTO events (title, description, date, time, category, price, capacity, program)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertEvent.run(
    'Vivência Indígena',
    'Uma jornada profunda pelas tradições da terra.',
    '2026-03-28',
    '09:00',
    'Vivência Indígena',
    150.00,
    30,
    '🌿 Programação de Vivência 2026\nAldeia Multiétnica Filhos Desta Terra\n\nAberto ao público a partir das 9h\n\n🌞 Manhã\n10h — Toré\nRitual tradicional de abertura e conexão espiritual.\n11h — Trilha Ecológica\nCaminhada guiada para vivência com a natureza e saberes da terra.\n12h — Almoço\nMomento de partilha e alimentação coletiva.\n12h30 — Pintura Corporal\nExpressão cultural e ancestralidade através dos grafismos.\n\n🌿 Tarde\n13h — Pintura Artística\nAtividade cultural e criativa.\n14h — Trilha Ecológica\nNova saída para visitantes do período da tarde.\n15h — Trilha Cultural\nConhecimento sobre história, tradições e costumes.\n16h — Arco e Flecha\nVivência prática com orientação.\n17h — Encerramento com o Toré\nRitual de fechamento e agradecimento.\n\n*Sujeito a alterações conforme condições climáticas'
  );
} else {
  // Update existing events if they match the old names
  db.prepare("UPDATE events SET title = 'Vivência Indígena', category = 'Vivência Indígena' WHERE title = 'Vivência Ancestral' OR title = 'Vivência Indígena'").run();
  db.prepare("UPDATE events SET title = 'Oficina de Artesanato Indígena' WHERE title = 'Oficina de Cerâmica'").run();
}

export default db;
