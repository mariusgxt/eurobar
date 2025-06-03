-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Create product table
CREATE TABLE IF NOT EXISTS products (
    barcode SERIAL PRIMARY KEY,
    region VARCHAR(50) UNIQUE NOT NULL,
    company VARCHAR(100) NOT NULL
);

-- Insert example user and product
INSERT INTO users (username, password, email) VALUES
('admin', 'admin123', 'admin@example.com'),
('testuser', 'test123', 'test@example.com');

INSERT INTO products (barcode, region, company) VALUES
('4005906005377', 'Frankreich', 'Adelholzener');
