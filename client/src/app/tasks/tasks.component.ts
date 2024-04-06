import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskProps } from 'src/types/taskTypes';
import { TaskService } from '../service/task.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  isLoggedIn = false;
  tasks: TaskProps[] = [];
  responseMessage = '';
  errorMessage: string | null = null;
  searchMode = false;

  selectedTask: TaskProps | null = null;
  moreLessTask: TaskProps | null = null;
  showCreateModal = false;
  showUpdateModal = false;
  showDeleteModal = false;

  constructor(private taskService: TaskService, private router: Router) {
    // Subscribe to isLoggedIn$ Observable from TaskService to update isLoggedIn value
    this.taskService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      // Fetch tasks if user logged in
      if (this.isLoggedIn) {
        this.getUserTasks();
      }
    });
  }

  // Fetch user's tasks
  getUserTasks() {
    this.taskService.getUserTasks().subscribe({
      next: (tasks: TaskProps[]) => {
        // Sort tasks by due date
        this.tasks = tasks.sort(
          (a, b) =>
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Filter tasks on status
  getFilteredTasks(status: string) {
    this.taskService.getFilteredTasks(status).subscribe({
      next: (items: TaskProps[]) => {
        this.tasks = items;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Filter tasks by status
  filterTasksByStatus(status: NgForm) {
    if (status.value.status === 'all') {
      this.getUserTasks();
    } else {
      this.getFilteredTasks(status.value.status);
    }
  }

  // Search tasks by title
  searchTasksByTitle(searchQuery: NgForm) {
    this.taskService.searchTasksByTitle(searchQuery.value.title).subscribe({
      next: (tasks: TaskProps[]) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error;
      },
    });
  }

  // Toggle search mode
  toggleSearchMode() {
    this.searchMode = !this.searchMode;
    if (!this.searchMode) {
      this.getUserTasks();
    }
  }

  // Toggle create task modal
  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal;
  }

  // Show more details of task
  showMoreDetails(task: TaskProps) {
    this.moreLessTask = this.moreLessTask === task ? null : task;
  }

  // Toggle update task modal
  toggleUpdateModal(task: TaskProps) {
    this.selectedTask = task;
    this.showUpdateModal = !this.showUpdateModal;
  }

  // Toggle delete task modal
  toggleDeleteModal(task: TaskProps) {
    this.selectedTask = task;
    this.showDeleteModal = !this.showDeleteModal;
  }

  // Close all modals/backdrop
  closeBackdrop() {
    this.showCreateModal = false;
    this.showUpdateModal = false;
    this.showDeleteModal = false;
  }

  // Redirect to login page
  redirectToLogin() {
    this.router.navigate(['login']);
  }

  // Handle response message change
  handleResponseMessageChange(message: string) {
    this.responseMessage = message;
    setTimeout(() => {
      this.responseMessage = '';
    }, 2000);
  }

  // Check if task's due date has passed
  isTaskOverdue(task: TaskProps): boolean {
    const { status, due_date } = task;
    const dueDate = new Date(due_date);
    const currentDate = new Date();
    if (status === 'Pending' || status === 'In progress') {
      return dueDate < currentDate;
    }
    return false;
  }

  // Check if task is cancelled
  isTaskCancelled(task: TaskProps): boolean {
    return task.status === 'Cancelled';
  }

  // Check if task is completed
  isTaskCompleted(task: TaskProps): boolean {
    return task.status === 'Completed';
  }
}
