import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskProps } from 'src/types/taskTypes';
import { TaskService } from '../service/task.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  isLoggedIn = false;
  tasks: TaskProps[] = [];
  responseMessage = '';
  errorMessage: string | null = null;
  filterSearchMode = '';
  filter = 'status';
  selectedTask: TaskProps | null = null;
  moreLessTask: TaskProps | null = null;
  showCreateModal = false;
  showUpdateModal = false;
  showDeleteModal = false;

  constructor(private taskService: TaskService, private router: Router) {
    // Subscribe to login status changes
    this.taskService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.getUserTasks();
      }
    });
  }

  ngOnInit(): void {
    // If logged in fetch user
    if (this.isLoggedIn) {
      this.getUserTasks();
    }
  }

  // Fetch user tasks
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

  // Filter tasks based on form input
  filterTasks(form: NgForm) {
    const value = form.value;
    if (value.filter === 'status' || this.filter === 'status') {
      this.filterTasksByStatus(value.status);
    } else if (value.filter === 'priority') {
      this.filterTasksByPriority(value.priority);
    }
  }

  // Filter tasks by status
  filterTasksByStatus(status: string) {
    if (status === 'all') {
      this.getUserTasks();
    } else {
      this.taskService.getFilteredTasksByStatus(status).subscribe({
        next: (items: TaskProps[]) => {
          this.tasks = items;
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  // Filter tasks by priority
  filterTasksByPriority(priority: string) {
    if (priority === 'all') {
      this.getUserTasks();
    } else {
      this.taskService.getFilteredTasksByPriority(priority).subscribe({
        next: (items: TaskProps[]) => {
          this.tasks = items;
        },
        error: (err) => {
          console.error(err);
        },
      });
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

  // Toggle filter mode
  toggleFilterMode() {
    if (this.filterSearchMode !== 'filter') {
      this.getUserTasks();
      this.filterSearchMode = 'filter';
    } else {
      this.filterSearchMode = '';
    }
  }

  // Toggle search mode
  toggleSearchMode() {
    if (this.filterSearchMode !== 'search') {
      this.getUserTasks();
      this.filterSearchMode = 'search';
    } else {
      this.filterSearchMode = '';
    }
  }

  // Toggle create task modal
  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal;
  }

  // Show more details of a task
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

  // Close backdrop
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

  // Determine status CSS class
  isStatus(task: TaskProps) {
    const { status, due_date } = task;
    const dueDate = new Date(due_date);
    const currentDate = new Date();
    if (status === 'Completed') {
      return 'completed';
    } else if (
      (status === 'Pending' || status === 'In progress') &&
      dueDate < currentDate
    ) {
      return 'overdue';
    } else if (status === 'Cancelled') {
      return 'cancelled';
    }
    return null;
  }

  // Determine priority CSS class
  isPriority(task: TaskProps) {
    if (task.priority === 'High') {
      return 'high';
    } else if (task.priority === 'Medium') {
      return 'medium';
    } else if (task.priority === 'Low') {
      return 'low';
    }
    return 'urgent';
  }
}
