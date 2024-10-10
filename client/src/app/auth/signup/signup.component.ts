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
    // focus username input on init
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

  // Upload selected image to Cloudinary
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

  register(signUpForm: NgForm) {
    if (signUpForm.valid) {
      const password = signUpForm.value.password;
      const confirmPassword = signUpForm.value.confirmPassword;
      if (password !== confirmPassword) {
        this.errorMessage = 'PASSWORDS_DO_NOT_MATCH';
        return;
      }

      // Add selected image to signup data
      signUpForm.value.profile_picture = this.selectedImage;
      this.selectedFile = null;

      this.userService.register(signUpForm.value).subscribe({
        next: (item: UserResponseProps) => {
          const { token, user } = item;
          const userStorage = {
            token: token,
            id: user.user_id,
            username: user.username,
          };
          localStorage.setItem('user', JSON.stringify(userStorage));
          this.router.navigate(['tasks']);
        },
        error: (err) => {
          console.error(err);
          this.handleSignupError(err);
        },
      });
    } else {
      this.errorMessage = 'REQUIRED_FIELDS';
    }
  }

  private handleSignupError(err: any) {
    if (err.error.errors) {
      const errorMsg = err.error.errors[0].msg;
      if (errorMsg.includes('Username')) {
        this.errorMessage = 'USERNAME_EXISTS';
      } else if (errorMsg.includes('Email')) {
        this.errorMessage = 'EMAIL_EXISTS';
      } else {
        this.errorMessage = errorMsg;
      }
    } else {
      this.errorMessage = err.error;
    }
  }

  RedirectLogin() {
    this.router.navigate(['login']);
  }
}
