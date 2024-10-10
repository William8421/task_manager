import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent implements OnInit {
  @Output() changePasswordCanceled = new EventEmitter<void>();
  @Output() refreshUser = new EventEmitter<void>();
  @Output() profileResponse = new EventEmitter<string>();
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  hideOldPassword = false;
  hideNewPassword = false;
  hideConfirmPassword = false;
  errorMessage = '';

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.passwordInput.nativeElement.focus();
    });
  }

  // Close the change password modal
  closeChangePasswordModal() {
    this.changePasswordCanceled.emit();
  }

  // Handle password change
  changePassword(inputData: NgForm) {
    if (inputData.valid) {
      const password = inputData.value.password;
      const confirmNewPassword = inputData.value.confirmNewPassword;
      if (password !== confirmNewPassword) {
        this.errorMessage = 'Password and confirm password do not match.';
        return;
      }
      this.userService.changePassword(inputData.value).subscribe({
        next: (item: string) => {
          this.profileResponse.emit(item);
          this.closeChangePasswordModal();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error.errors[0].msg;
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields marked with *';
    }
  }
}
