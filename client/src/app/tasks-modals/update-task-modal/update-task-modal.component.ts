import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from 'src/app/service/task.service';
import { TaskProps, TaskResponseProps } from 'src/types/taskTypes';

@Component({
  selector: 'app-update-task-modal',
  templateUrl: './update-task-modal.component.html',
  styleUrls: ['./update-task-modal.component.scss'],
})
export class UpdateTaskModalComponent {
  // Event emitters
  @Input() task: TaskProps | null = null;
  @Output() updateCanceled = new EventEmitter<void>();
  @Output() refreshTasks = new EventEmitter<void>();
  @Output() responseMessage = new EventEmitter<string>();

  constructor(private taskService: TaskService) {}

  // Close update task modal
  closeUpdateModal() {
    this.updateCanceled.emit();
  }

  // Update a task
  updateTask(updateTaskForm: NgForm, taskId: string) {
    this.taskService.updateTask(updateTaskForm.value, taskId).subscribe({
      next: (item: TaskResponseProps) => {
        this.responseMessage.emit(item.message);
        this.closeUpdateModal();
        this.refreshTasks.emit();
      },
    });
  }
}
