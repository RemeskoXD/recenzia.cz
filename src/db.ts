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
    const [rows]: any = await connection.query('SELECT * FROM companies WHERE id = 1');
    if (rows.length === 0) {
      // Default password is 'password' (hashed in server.ts, but here we just insert plain if needed, or better, let the user register)
      // We will insert a hashed password for 'password' (sha256)
      const crypto = await import('crypto');
      const hashedPassword = crypto.createHash('sha256').update('password').digest('hex');
      
      await connection.query(
        'INSERT INTO companies (id, name, email, password, redirect_url, plan) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 'Mescon digital s.r.o.', 'info@mescon.cz', hashedPassword, 'https://www.google.com/search?q=Mescon+digital+s.r.o.', 'premium']
      );
    }

    connection.release();
    console.log("MySQL Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing MySQL database. Please check your credentials in .env file:", error);
  }
}

export default pool;
