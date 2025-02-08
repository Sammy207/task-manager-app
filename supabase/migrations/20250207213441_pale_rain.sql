/*
  # Initial Schema Setup for Task Management App

  1. Tables
    - profiles
      - Stores user profile information
      - Links to Supabase Auth
    - tasks
      - Main tasks table
      - Stores task details and assignments
    - categories
      - Task categories/labels
      - Custom organization system

  2. Security
    - RLS enabled on all tables
    - Policies for secure data access
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  PRIMARY KEY (id),
  CONSTRAINT username_length CHECK (char_length(full_name) >= 3)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL,
  assigned_to UUID REFERENCES auth.users,
  category_id UUID REFERENCES categories,
  
  CONSTRAINT valid_status CHECK (status IN ('todo', 'in_progress', 'completed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high'))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view tasks assigned to them"
  ON tasks FOR SELECT
  USING (auth.uid() = assigned_to);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own categories"
  ON categories FOR ALL
  USING (auth.uid() = user_id);