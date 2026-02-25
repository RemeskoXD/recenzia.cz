-- Tabulka pro firmy (uživatele)
CREATE TABLE companies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    redirect_url VARCHAR(255),
    custom_question VARCHAR(255),
    positive_threshold INT DEFAULT 5,
    url_google VARCHAR(255),
    url_facebook VARCHAR(255),
    url_firmy VARCHAR(255),
    url_tripadvisor VARCHAR(255),
    qr_color VARCHAR(50) DEFAULT '#0ea5e9',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabulka pro recenze
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    company_id VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    source VARCHAR(255),
    archived TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexy pro rychlejší vyhledávání
CREATE INDEX idx_company_id ON reviews(company_id);
CREATE INDEX idx_rating ON reviews(rating);
CREATE INDEX idx_created_at ON reviews(created_at);
