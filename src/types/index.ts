export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
  user_id: string;
  assigned_to?: string;
  category_id?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
}