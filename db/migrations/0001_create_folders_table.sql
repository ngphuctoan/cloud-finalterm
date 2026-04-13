CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INT REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);
