import mysql from 'mysql2/promise';

// Vytvoření poolu připojení k MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'databaza1.itnahodinu.cz',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recenzia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inicializace databáze (vytvoření tabulek, pokud neexistují)
export async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Tabulka pro firmy
    await connection.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        redirect_url VARCHAR(255),
        plan VARCHAR(50) DEFAULT 'basic',
        role VARCHAR(50) DEFAULT 'user',
        expires_at TIMESTAMP NULL,
        stripe_customer_id VARCHAR(255),
        custom_question VARCHAR(255),
        positive_threshold INT DEFAULT 5,
        url_google VARCHAR(255),
        url_facebook VARCHAR(255),
        url_firmy VARCHAR(255),
        url_tripadvisor VARCHAR(255),
        qr_color VARCHAR(50) DEFAULT '#0ea5e9',
        qr_bg_color VARCHAR(50) DEFAULT '#ffffff',
        qr_style VARCHAR(50) DEFAULT 'squares',
        qr_logo VARCHAR(50) DEFAULT 'none',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabulka pro recenze
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        source VARCHAR(255),
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        country VARCHAR(50),
        archived TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Migrace: Přidání sloupců pokud neexistují (pro existující instalace)
    try {
      await connection.query("ALTER TABLE companies ADD COLUMN role VARCHAR(50) DEFAULT 'user'");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE companies ADD COLUMN expires_at TIMESTAMP NULL");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE companies ADD COLUMN stripe_customer_id VARCHAR(255)");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE companies ADD COLUMN qr_bg_color VARCHAR(50) DEFAULT '#ffffff'");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE companies ADD COLUMN qr_style VARCHAR(50) DEFAULT 'squares'");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE companies ADD COLUMN qr_logo VARCHAR(50) DEFAULT 'none'");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE reviews ADD COLUMN customer_name VARCHAR(255)");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE reviews ADD COLUMN customer_email VARCHAR(255)");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE reviews ADD COLUMN customer_phone VARCHAR(50)");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE reviews ADD COLUMN country VARCHAR(50)");
    } catch (e) {}

    // Seed default company if not exists
    const crypto = await import('crypto');
    
    // Admin 1
    const [admin1Rows]: any = await connection.query('SELECT * FROM companies WHERE email = ?', ['ludvikremesekwork@gmail.com']);
    if (admin1Rows.length === 0) {
      const hashedAdmin1 = crypto.createHash('sha256').update('Mescon2025.2026.*').digest('hex');
      await connection.query(
        'INSERT INTO companies (name, email, password, role, plan) VALUES (?, ?, ?, ?, ?)',
        ['Admin Ludvík', 'ludvikremesekwork@gmail.com', hashedAdmin1, 'admin', 'premium']
      );
    }

    // Admin 2
    const [admin2Rows]: any = await connection.query('SELECT * FROM companies WHERE email = ?', ['vaclav.gabriel@mescon.com']);
    if (admin2Rows.length === 0) {
      const hashedAdmin2 = crypto.createHash('sha256').update('Mescon2025.').digest('hex');
      await connection.query(
        'INSERT INTO companies (name, email, password, role, plan) VALUES (?, ?, ?, ?, ?)',
        ['Admin Václav', 'vaclav.gabriel@mescon.com', hashedAdmin2, 'admin', 'premium']
      );
    }


    connection.release();
    console.log("MySQL Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing MySQL database. Please check your credentials in .env file:", error);
  }
}

export default pool;
