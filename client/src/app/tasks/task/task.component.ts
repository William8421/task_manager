import { Component, Input } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
import { TaskProps } from 'src/types/taskTypes';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  moreLessTask: TaskProps | null = null;
  selectedTask: TaskProps | null = null;
  showUpdateModal = false;
  showDeleteModal = false;
  responseMessage = '';

  @Input() tasks: TaskProps[] | null = null;

  constructor(private taskService: TaskService) {}

  // Fetch user's tasks
  getUserTasks() {
    this.taskService.getUserTasks().subscribe({
      next: (tasks: TaskProps[]) => {
        // Sort tasks by due date
        this.tasks = tasks.sort((a, b) => {
          const dateA = new Date(a.due_date);
          const dateB = new Date(b.due_date);

          return dateA.getTime() - dateB.getTime();
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  showMoreDetails(task: TaskProps) {
    // Toggle visibility of details for the selected task
    this.moreLessTask = this.moreLessTask === task ? null : task;
  }

  // Open close update task modal
  toggleUpdateModal(task: TaskProps) {
    this.selectedTask = task;
    this.showUpdateModal = !this.showUpdateModal;
  }

  // Open Close delete task modal
  toggleDeleteModal(task: TaskProps) {
    this.selectedTask = task;
    this.showDeleteModal = !this.showDeleteModal;
  }

  // Close all modals/backdrop
  closeBackdrop() {
    this.showUpdateModal = false;
    this.showDeleteModal = false;
  }

  // Check if task's due date has passed
  isTaskOverdue(task: TaskProps): boolean {
    const { status, due_date } = task;
    const dueDate = new Date(due_date);
    const currentDate = new Date();
    if (status === 'pending') {
      return dueDate < currentDate;
    }
    return false;
  }

  isTaskCancelled(task: TaskProps): boolean {
    return task.status === 'cancelled';
  }
  isTaskCompleted(task: TaskProps): boolean {
    return task.status === 'completed';
  }

  // Handle response message change
  handleResponseMessageChange(message: string) {
    this.responseMessage = message;
    setTimeout(() => {
      this.responseMessage = '';
    }, 2000);
  }
}
