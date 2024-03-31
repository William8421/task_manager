import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from 'src/app/service/task.service';
import { TaskResponseProps } from 'src/types/taskTypes';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
})
export class CreateTaskModalComponent {
  // Event emitters
  @Output() createCanceled = new EventEmitter<void>();
  @Output() refreshTasks = new EventEmitter<void>();
  @Output() responseMessage = new EventEmitter<string>();

  requiredError = '';

  constructor(private taskService: TaskService) {}

  // close create task modal
  closeCreateModal() {
    this.createCanceled.emit();
  }

  // create a new task
  createTask(newTaskForm: NgForm) {
    if (newTaskForm.valid) {
      if (!newTaskForm.value.status) {
        newTaskForm.value.status = 'pending';
      }
      this.taskService.createTask(newTaskForm.value).subscribe({
        next: (item: TaskResponseProps) => {
          this.responseMessage.emit(item.message);
          this.closeCreateModal();
          this.refreshTasks.emit();
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.requiredError = 'Please fill in all required fields marked with *'; // Set error message for required fields
    }
  }
}
