import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import {
  CloudinaryUploadResponse,
  UserResponseProps,
} from 'src/types/userTypes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoggedIn = false;
  hide = false;
  hideConfirm = false;
  errorMessage = '';
  imageName = '';
  selectedImage = '';
  selectedFile: File | null = null;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  // Cloudinary upload parameters
  uploadPreset = environment.cloudinaryUploadPreset;
  uploadName = environment.cloudinaryUploadName;
  uploadFolder = environment.cloudinaryUploadFolder;

  constructor(private userService: UserService, private router: Router) {
    // Subscribe to the isLoggedIn$ Observable from UserService to update isLoggedIn value
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit(): void {
    // if user logged in Redirect to home
    if (this.isLoggedIn) {
      this.router.navigate(['']);
    }
    // focus username input on in it
    setTimeout(() => {
      if (this.usernameInput) {
        this.usernameInput.nativeElement.focus();
      }
    });
  }

  selectFile() {
    const fileInput = document.getElementById('profile_picture');
    if (fileInput) {
      fileInput.click();
    }
  }

  // Store selected file
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.imageName = inputElement.files[0].name;
    }
  }
  //  Upload selected image to Cloudinary
  uploadImage() {
    if (this.selectedFile) {
      // Prepare form data for image upload
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('upload_name', this.uploadName);
      formData.append('folder', this.uploadFolder);

      // Upload image using UserService
      this.userService.uploadImage(formData).subscribe({
        next: (response: CloudinaryUploadResponse) => {
          // Store uploaded image URL
          this.selectedImage = response.secure_url;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        },
      });
    }
  }

  register(sigUpForm: NgForm) {
    if (sigUpForm.valid) {
      // Check if signup form is valid
      const password = sigUpForm.value.password;
      const confirmPassword = sigUpForm.value.confirmPassword;
      if (password !== confirmPassword) {
        // Check if passwords match
        this.errorMessage = 'Password and confirm password do not match.';
        return;
      }

      // Add selected image to signup data
      sigUpForm.value.profile_picture = this.selectedImage;
      // Clear selected file
      this.selectedFile = null;

      this.userService.register(sigUpForm.value).subscribe({
        next: (item: UserResponseProps) => {
          const { token, user } = item;
          // Create user object
          const userStorage = {
            token: token,
            id: user.user_id,
            username: user.username,
          };
          // Store user object in local storage
          localStorage.setItem('user', JSON.stringify(userStorage));
          // Navigate to tasks page
          this.router.navigate(['tasks']);
        },
        error: (err) => {
          console.error(err);
          // Handle server errors
          this.errorMessage = err.error.errors
            ? err.error.errors[0].msg
            : err.error;
        },
      });
    } else {
      // signup form errors
      this.errorMessage = 'Please fill in all required fields marked with *!';
    }
  }

  RedirectLogin() {
    // Navigate to login page
    this.router.navigate(['login']);
  }
}
