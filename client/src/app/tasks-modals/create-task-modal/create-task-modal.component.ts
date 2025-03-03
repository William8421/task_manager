import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from 'src/app/service/task.service';
import { TaskResponseProps } from 'src/types/taskTypes';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
})
export class CreateTaskModalComponent implements OnInit {
  // Event emitters
  @Output() toggleCreateModal = new EventEmitter<void>();
  @Output() refreshTasks = new EventEmitter<void>();
  @Output() responseMessage = new EventEmitter<string>();
  @ViewChild('titleInput') titleInput!: ElementRef;

  requiredError = '';
  selectedTime: string = '';
  defaultStatus: string = 'Pending';
  defaultPriority: string = 'Medium';

  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    });
  }

  // close create task modal
  closeCreateModal() {
    this.toggleCreateModal.emit();
  }

  // create a new task
  createTask(newTaskForm: NgForm) {
    if (newTaskForm.valid) {
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
      this.requiredError = 'Please fill in all required fields marked with *';
    }
  }
}
