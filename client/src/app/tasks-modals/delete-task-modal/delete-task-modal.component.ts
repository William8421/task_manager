import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
import { TaskProps, TaskResponseProps } from 'src/types/taskTypes';

@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.scss'],
})
export class DeleteTaskModalComponent {
  // Event emitters
  @Input() task: TaskProps | null = null;
  @Output() toggleDeleteModal = new EventEmitter<void>();
  @Output() refreshTasks = new EventEmitter<void>();
  @Output() responseMessage = new EventEmitter<string>();

  constructor(private taskService: TaskService) {}

  // close delete task modal
  closeDeleteModal() {
    this.toggleDeleteModal.emit();
  }

  // delete a task
  deleteTask(task: TaskProps) {
    if (this.task) {
      this.taskService.deleteTask(this.task.task_id).subscribe({
        next: (item: TaskResponseProps) => {
          this.responseMessage.emit(item.message);
          setTimeout(() => {
            this.responseMessage.emit('');
          }, 3000);
          this.closeDeleteModal();
          this.refreshTasks.emit();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
