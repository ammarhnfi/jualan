CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    price DECIMAL(10, 2),
    contact VARCHAR(255) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS listings_location_gix ON listings USING GIST (location);

-- Add device fingerprinting column for rate limits
ALTER TABLE listings ADD COLUMN IF NOT EXISTS device_id VARCHAR(255);

-- Insert default categories if not exists
INSERT INTO categories (name, icon)
SELECT 'Food', '🍔'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Food');

INSERT INTO categories (name, icon)
SELECT 'Services', '🛠️'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Services');

INSERT INTO categories (name, icon)
SELECT 'Retail', '🛍️'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Retail');
