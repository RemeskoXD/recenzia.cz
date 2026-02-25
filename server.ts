import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createHash } from 'crypto';
import pool, { initDb } from './src/db.js';

async function getCountryFromIp(ip: string): Promise<string> {
  try {
    if (ip === '::1' || ip === '127.0.0.1') return 'CZ';
    const response = await fetch(`https://ipapi.co/${ip}/country/`);
    if (response.ok) {
      const country = await response.text();
      return country.trim();
    }
    return 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize DB
  await initDb();

  // Sitemap Endpoint
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const [companies]: any = await pool.query('SELECT id FROM companies');
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      // Homepage
      xml += `
        <url>
          <loc>https://${req.get('host')}/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      `;

      // Review pages for each company
      companies.forEach((company: any) => {
        xml += `
          <url>
            <loc>https://${req.get('host')}/review/${company.id}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      });

      xml += '</urlset>';
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  });

  // Test DB Connection Endpoint
  app.get('/api/test-db', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      
      // Check tables
      const [tables]: any = await connection.query('SHOW TABLES');
      
      connection.release();
      res.json({ 
        status: 'success', 
        message: 'Connected to database successfully!',
        tables: tables,
        config: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        }
      });
    } catch (error: any) {
      console.error('Database connection test failed:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Connection failed', 
        error: error.message,
        code: error.code,
        details: error
      });
    }
  });

  // DANGEROUS: Endpoint to reset database schema
  app.get('/api/fix-db', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      
      // Drop existing tables
      await connection.query('DROP TABLE IF EXISTS reviews');
      await connection.query('DROP TABLE IF EXISTS companies');
      
      // Re-create tables with correct schema
      await connection.query(`
        CREATE TABLE companies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          redirect_url VARCHAR(255),
          plan VARCHAR(50) DEFAULT 'basic',
          custom_question VARCHAR(255),
          positive_threshold INT DEFAULT 5,
          url_google VARCHAR(255),
          url_facebook VARCHAR(255),
          url_firmy VARCHAR(255),
          url_tripadvisor VARCHAR(255),
          qr_color VARCHAR(50) DEFAULT '#0ea5e9',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await connection.query(`
        CREATE TABLE reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          company_id INT NOT NULL,
          rating INT NOT NULL,
          comment TEXT,
          source VARCHAR(255),
          archived TINYINT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      connection.release();
      res.json({ success: true, message: "Database schema fixed successfully!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Routes
  app.post('/api/register', async (req, res) => {
    const { name, email, password, plan } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      
      const [result]: any = await pool.query(
        'INSERT INTO companies (name, email, password, plan) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, plan || 'basic']
      );
      
      res.status(201).json({ success: true, companyId: result.insertId });
    } catch (error: any) {
      console.error('Registration error:', error); // Log full error to console
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ 
          error: 'Database error', 
          details: error.message // Send error details to client for debugging
        });
      }
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      const [rows]: any = await pool.query('SELECT id, name FROM companies WHERE email = ? AND password = ?', [email, hashedPassword]);
      const company = rows[0];

      if (company) {
        res.json({ success: true, companyId: company.id, companyName: company.name });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const [rows]: any = await pool.query('SELECT id, name, redirect_url, custom_question, positive_threshold, url_google, url_facebook, url_firmy, url_tripadvisor, qr_color, qr_bg_color, qr_style, qr_logo FROM companies WHERE id = ?', [req.params.id]);
      const company = rows[0];
      
      if (company) {
        res.json(company);
      } else {
        res.status(404).json({ error: 'Company not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/companies/:id/usage', async (req, res) => {
    try {
      const companyId = req.params.id;
      const [companyRows]: any = await pool.query('SELECT plan FROM companies WHERE id = ?', [companyId]);
      const company = companyRows[0];
      
      if (!company) return res.status(404).json({ error: 'Company not found' });

      // Get current month's reviews count
      const [countRows]: any = await pool.query(
        "SELECT COUNT(*) as count FROM reviews WHERE company_id = ? AND created_at >= DATE_FORMAT(NOW() ,'%Y-%m-01')",
        [companyId]
      );
      
      res.json({
        plan: company.plan,
        usage: countRows[0].count
      });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/companies/:id/stats', async (req, res) => {
    try {
      const companyId = req.params.id;
      
      // Daily stats for the last 30 days
      const [dailyRows]: any = await pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as total
        FROM reviews 
        WHERE company_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `, [companyId]);

      // Sources stats
      const [sourceRows]: any = await pool.query(`
        SELECT source as name, COUNT(*) as count
        FROM reviews
        WHERE company_id = ? AND source IS NOT NULL AND source != ''
        GROUP BY source
      `, [companyId]);

      // Country stats
      const [countryRows]: any = await pool.query(`
        SELECT country as name, COUNT(*) as count
        FROM reviews
        WHERE company_id = ? AND country IS NOT NULL AND country != '' AND country != 'Unknown'
        GROUP BY country
      `, [companyId]);

      // Average rating
      const [avgRows]: any = await pool.query(`
        SELECT AVG(rating) as average FROM reviews WHERE company_id = ?
      `, [companyId]);

      res.json({
        daily: dailyRows,
        sources: sourceRows,
        countries: countryRows,
        average: avgRows[0].average ? Number(avgRows[0].average).toFixed(1) : 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.put('/api/companies/:id', async (req, res) => {
    const { 
      name, redirect_url, custom_question, password,
      positive_threshold, url_google, url_facebook, url_firmy, url_tripadvisor, 
      qr_color, qr_bg_color, qr_style, qr_logo
    } = req.body;
    const id = req.params.id;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      let result: any;
      if (password) {
        const hashedPassword = createHash('sha256').update(password).digest('hex');
        [result] = await pool.query(`
          UPDATE companies 
          SET name = ?, redirect_url = ?, custom_question = ?, password = ?,
              positive_threshold = ?, url_google = ?, url_facebook = ?, url_firmy = ?, url_tripadvisor = ?, 
              qr_color = ?, qr_bg_color = ?, qr_style = ?, qr_logo = ?
          WHERE id = ?
        `, [
          name, redirect_url, custom_question, hashedPassword,
          positive_threshold || 5, url_google || null, url_facebook || null, url_firmy || null, url_tripadvisor || null, 
          qr_color || '#0ea5e9', qr_bg_color || '#ffffff', qr_style || 'squares', qr_logo || 'none',
          id
        ]);
      } else {
        [result] = await pool.query(`
          UPDATE companies 
          SET name = ?, redirect_url = ?, custom_question = ?,
              positive_threshold = ?, url_google = ?, url_facebook = ?, url_firmy = ?, url_tripadvisor = ?, 
              qr_color = ?, qr_bg_color = ?, qr_style = ?, qr_logo = ?
          WHERE id = ?
        `, [
          name, redirect_url, custom_question,
          positive_threshold || 5, url_google || null, url_facebook || null, url_firmy || null, url_tripadvisor || null, 
          qr_color || '#0ea5e9', qr_bg_color || '#ffffff', qr_style || 'squares', qr_logo || 'none',
          id
        ]);
      }

      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Company not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/companies/:id/export', async (req, res) => {
    const companyId = req.params.id;
    try {
      const [reviews]: any = await pool.query('SELECT rating, comment, source, customer_name, customer_email, customer_phone, created_at FROM reviews WHERE company_id = ? ORDER BY created_at DESC', [companyId]);
      
      if (reviews.length === 0) {
        return res.status(404).send('No reviews found');
      }

      const header = ['Datum', 'Hodnoceni', 'Zdroj', 'Jmeno', 'Email', 'Telefon', 'Komentar'];
      const rows = reviews.map((r: any) => [
        new Date(r.created_at).toLocaleString('cs-CZ'),
        r.rating,
        r.source || '',
        r.customer_name || '',
        r.customer_email || '',
        r.customer_phone || '',
        `"${(r.comment || '').replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [header.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="recenze-${companyId}.csv"`);
      res.send('\uFEFF' + csvContent);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/widget/:id/data', async (req, res) => {
    const companyId = req.params.id;
    try {
      const [statsRows]: any = await pool.query(`
        SELECT COUNT(*) as total, AVG(rating) as average
        FROM reviews 
        WHERE company_id = ? AND rating >= 4
      `, [companyId]);
      const stats = statsRows[0];
      
      const [companyRows]: any = await pool.query('SELECT name FROM companies WHERE id = ?', [companyId]);
      const company = companyRows[0];
      
      if (!company) return res.status(404).json({ error: 'Not found' });
      
      res.json({
        name: company.name,
        total: stats.total || 0,
        average: stats.average ? Number(stats.average).toFixed(1) : 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    const { company_id, rating, comment, source, customer_name, customer_email, customer_phone } = req.body;
    
    if (!company_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Check limits for basic plan
      const [companyRows]: any = await pool.query('SELECT plan FROM companies WHERE id = ?', [company_id]);
      const company = companyRows[0];
      
      if (company && company.plan === 'basic') {
        const [countRows]: any = await pool.query(
          "SELECT COUNT(*) as count FROM reviews WHERE company_id = ? AND created_at >= DATE_FORMAT(NOW() ,'%Y-%m-01')",
          [company_id]
        );
        if (countRows[0].count >= 300) {
          return res.status(403).json({ error: 'Monthly limit reached' });
        }
      }

      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const country = await getCountryFromIp(ip as string);

      const [result]: any = await pool.query(
        'INSERT INTO reviews (company_id, rating, comment, source, customer_name, customer_email, customer_phone, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [company_id, rating, comment, source || null, customer_name || null, customer_email || null, customer_phone || null, country]
      );
      
      res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/reviews/:companyId', async (req, res) => {
    const showArchived = req.query.archived === 'true';
    try {
      let query = 'SELECT * FROM reviews WHERE company_id = ?';
      if (!showArchived) {
        query += ' AND archived = false';
      }
      query += ' ORDER BY created_at DESC';
      
      const [reviews]: any = await pool.query(query, [req.params.companyId]);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.put('/api/reviews/:id/archive', async (req, res) => {
    try {
      const [result]: any = await pool.query('UPDATE reviews SET archived = true WHERE id = ?', [req.params.id]);
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Review not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
