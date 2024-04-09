export interface TaskProps {
  task_id: string;
  title: string;
  description: string;
  due_date: Date;
  status: string;
  priority: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskResponseProps {
  task: TaskProps | null;
  message: string;
}
