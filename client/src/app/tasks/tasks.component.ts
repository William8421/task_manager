import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskProps } from 'src/types/taskTypes';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  isLoggedIn = false;
  tasks: TaskProps[] = [];
  responseMessage = '';
  showCreateModal = false;

  constructor(private taskService: TaskService, private router: Router) {
    // Subscribe to the isLoggedIn$ Observable from TaskService to update isLoggedIn value
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

  // Open close create task modal
  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal;
  }

  // Close all modals/backdrop
  closeBackdrop() {
    this.showCreateModal = false;
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
}
