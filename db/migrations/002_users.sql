CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
      CHECK (role IN ('user', 'manager', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

TRUNCATE tasks;

ALTER TABLE tasks
ADD COLUMN user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX tasks_user_id_idx ON tasks(user_id);