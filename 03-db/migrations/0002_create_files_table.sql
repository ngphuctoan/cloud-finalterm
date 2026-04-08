CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  bucket_key TEXT NOT NULL,
  folder_id INT REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);
