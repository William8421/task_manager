import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from 'src/app/service/task.service';
import { TaskProps, TaskResponseProps } from 'src/types/taskTypes';

@Component({
  selector: 'app-update-task-modal',
  templateUrl: './update-task-modal.component.html',
  styleUrls: ['./update-task-modal.component.scss'],
})
export class UpdateTaskModalComponent implements OnInit {
  // Event emitters
  @Input() task: TaskProps | null = null;
  @Output() toggleUpdateModal = new EventEmitter<void>();
  @Output() refreshTasks = new EventEmitter<void>();
  @Output() responseMessage = new EventEmitter<string>();
  @ViewChild('titleInput') titleInput!: ElementRef;

  editedTask: TaskProps | null = null;

  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    if (this.task) {
      this.editedTask = { ...this.task };
    }
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    });
  }

  // Close update task modal
  closeUpdateModal() {
    this.toggleUpdateModal.emit();
  }

  // Update a task
  updateTask(updateTaskForm: NgForm) {
    if (!this.editedTask) return;

    this.taskService
      .updateTask(this.editedTask, this.editedTask.task_id)
      .subscribe({
        next: (item: TaskResponseProps) => {
          this.responseMessage.emit(item.message);
          this.closeUpdateModal();
          this.refreshTasks.emit();
        },
      });
  }
}
