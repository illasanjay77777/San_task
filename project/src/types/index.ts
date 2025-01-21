export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  weather?: {
    temp: number;
    description: string;
    icon: string;
  };
}

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}