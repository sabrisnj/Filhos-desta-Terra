import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Events
  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events ORDER BY date ASC").all();
    res.json(events);
  });

  app.post("/api/events", (req, res) => {
    const { title, description, date, time, category, price, capacity, program } = req.body;
    const info = db.prepare(`
      INSERT INTO events (title, description, date, time, category, price, capacity, program)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, date, time, category, price, capacity, program);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/events/:id", (req, res) => {
    db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Visits
  app.get("/api/visits", (req, res) => {
    const visits = db.prepare("SELECT * FROM visits ORDER BY visit_date DESC").all();
    res.json(visits);
  });

  app.post("/api/visits", (req, res) => {
    const { name, phone, email, visit_date, people_count, visit_type, category, food, period, observations } = req.body;
    
    // Check capacity per category
    const settingKey = `capacity_${category}`;
    let capacitySetting = db.prepare("SELECT value FROM settings WHERE key = ?").get(settingKey) as { value: string } | undefined;
    
    // Fallback to daily_capacity if specific category capacity is not set
    if (!capacitySetting) {
      capacitySetting = db.prepare("SELECT value FROM settings WHERE key = 'daily_capacity'").get() as { value: string };
    }
    
    const maxCapacity = parseInt(capacitySetting?.value || '20');
    
    const currentVisits = db.prepare("SELECT SUM(people_count) as total FROM visits WHERE visit_date = ? AND category = ? AND status != 'cancelled'").get(visit_date, category) as { total: number | null };
    const currentTotal = currentVisits.total || 0;
    
    if (currentTotal + parseInt(people_count) > maxCapacity) {
      return res.status(400).json({ error: `Capacidade máxima atingida para a atividade ${category} nesta data.` });
    }

    const info = db.prepare(`
      INSERT INTO visits (name, phone, email, visit_date, people_count, visit_type, category, food, period, observations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, phone, email, visit_date, people_count, visit_type, category, food, period, observations);
    
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/visits/lookup", (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const visits = db.prepare(`
      SELECT * FROM visits 
      WHERE email = ? OR phone = ? 
      ORDER BY visit_date DESC
    `).all(query, query);
    
    res.json(visits);
  });

  app.patch("/api/visits/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE visits SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  // Stories
  app.get("/api/stories", (req, res) => {
    const publishedOnly = req.query.published === 'true';
    const query = publishedOnly ? "SELECT * FROM stories WHERE published = 1" : "SELECT * FROM stories";
    const stories = db.prepare(query).all();
    res.json(stories);
  });

  app.post("/api/stories", (req, res) => {
    const { title, content, published, image_seed } = req.body;
    const info = db.prepare(`
      INSERT INTO stories (title, content, published, image_seed)
      VALUES (?, ?, ?, ?)
    `).run(title, content, published ? 1 : 0, image_seed);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/stories/:id", (req, res) => {
    const { title, content, published, image_seed } = req.body;
    db.prepare(`
      UPDATE stories 
      SET title = ?, content = ?, published = ?, image_seed = ?
      WHERE id = ?
    `).run(title, content, published ? 1 : 0, image_seed, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/stories/:id", (req, res) => {
    db.prepare("DELETE FROM stories WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
