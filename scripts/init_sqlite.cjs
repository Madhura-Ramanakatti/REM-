const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../local.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    type TEXT,
    category TEXT,
    location TEXT,
    city TEXT,
    state TEXT DEFAULT 'Karnataka',
    bedrooms INTEGER,
    bathrooms INTEGER,
    area INTEGER,
    year_built INTEGER,
    images TEXT, -- stored as JSON string
    features TEXT, -- stored as JSON string
    agent_id TEXT REFERENCES profiles(id),
    is_featured BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id),
    property_id TEXT REFERENCES properties(id),
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id),
    property_id TEXT REFERENCES properties(id),
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT REFERENCES profiles(id),
    receiver_id TEXT REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Local SQLite database initialized successfully.');
