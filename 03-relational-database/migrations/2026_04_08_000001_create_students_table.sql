CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(7) NOT NULL UNIQUE,
  full_name VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  major VARCHAR(50) NOT NULL
);

INSERT INTO students (student_id, full_name, department, major) VALUES
  ('27A0001', 'Nguyen Van A', 'Information Technology', 'Computer Science'),
  ('27A0002', 'Tran Thi B', 'Information Technology', 'Software Engineering'),
  ('27B0001', 'Le Van C', 'Business Administration', 'Marketing');
