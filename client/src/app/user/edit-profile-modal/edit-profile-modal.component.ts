import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import {
  CloudinaryUploadResponse,
  UserProps,
  UserResponseProps,
} from 'src/types/userTypes';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent {
  @Input() user: UserProps | null = null;
  @Output() editCanceled = new EventEmitter<void>();
  @Output() refreshUser = new EventEmitter<void>();
  @Output() profileResponse = new EventEmitter<string>();

  selectedFile: File | null = null;
  selectedImage = '';
  errorMessage = '';
  imageName = '';

  // Cloudinary upload parameters
  uploadPreset = environment.cloudinaryUploadPreset;
  uploadName = environment.cloudinaryUploadName;
  uploadFolder = environment.cloudinaryUploadFolder;

  constructor(private userService: UserService) {}

  selectFile() {
    const fileInput = document.getElementById('profile_picture');
    if (fileInput) {
      fileInput.click();
    }
  }

  // Handle file selection for profile picture upload
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.imageName = inputElement.files[0].name;
    }
  }

  // Upload selected image to Cloudinary
  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('upload_name', this.uploadName);
      formData.append('folder', this.uploadFolder);

      this.userService.uploadImage(formData).subscribe({
        next: (response: CloudinaryUploadResponse) => {
          this.selectedImage = response.secure_url;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        },
      });
    }
  }

  // Close edit profile modal
  closeEditModal() {
    this.editCanceled.emit();
  }

  // Edit user profile
  editProfile(editProfileData: NgForm) {
    if (editProfileData.valid) {
      editProfileData.value.profile_picture = this.selectedImage;

      this.userService.editProfile(editProfileData.value).subscribe({
        next: (item: UserResponseProps) => {
          const { user } = item;
          this.profileResponse.emit(item.message);

          this.user = user;
          this.closeEditModal();
          this.refreshUser.emit();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error;
        },
      });
    }
  }
}
