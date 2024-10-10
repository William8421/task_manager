import { Component, OnInit } from '@angular/core';
import { UserProps, UserResponseProps } from 'src/types/userTypes';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false;
  showEditProfileModal = false;
  showChangePasswordModal = false;
  user: UserProps | null = null;
  profileResponse = '';

  constructor(private userService: UserService, private router: Router) {
    if (JSON.parse(localStorage.getItem('user')!)) {
      this.isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.getProfileInfo();
    }
  }

  // Fetch user profile
  getProfileInfo() {
    this.userService.getUserInfo().subscribe({
      next: (item: UserResponseProps) => {
        this.user = item.user;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Open the edit profile modal
  openEditProfileModal(user: UserProps) {
    this.user = user;
    this.showEditProfileModal = true;
  }

  openTempModal() {
    this.showEditProfileModal = true;
  }

  // Close the edit profile modal
  closeEditProfileModal() {
    this.showEditProfileModal = false;
  }

  // Open the change password modal
  openChangePasswordModal(user: UserProps) {
    this.user = user; // Set the user data
    this.showChangePasswordModal = true;
  }

  // Close the change password modal
  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  // Redirect to login page
  redirectToLogin() {
    this.router.navigate(['login']);
  }

  // Close all modals/backdrop
  closeBackdrop() {
    this.showEditProfileModal = false;
    this.showChangePasswordModal = false;
  }

  // Handle changes in profile response message
  handleProfileResponseChange(message: string) {
    this.profileResponse = message;
    setTimeout(() => {
      this.profileResponse = '';
    }, 2000);
  }
}
