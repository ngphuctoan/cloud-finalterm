ALTER TABLE files
ADD COLUMN mime_type TEXT;

UPDATE files
SET mime_type = ''
WHERE mime_type IS NULL;

ALTER TABLE files
ALTER COLUMN mime_type SET NOT NULL;
