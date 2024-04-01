import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { UserResponseProps } from 'src/types/userTypes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menu = false;
  isLoggedIn = false;
  userIcon: string | null = '';
  isScrolled = false;

  constructor(private router: Router, private userService: UserService) {
    // Subscribe to the isLoggedIn$ Observable from UserService to update isLoggedIn value
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userService.userIcon$.subscribe((userIcon) => {
      this.userIcon = userIcon;
    });
  }
  ngOnInit(): void {
    // If logged in fetch user
    if (this.isLoggedIn) {
      this.getUser();
    }
  }

  getUser() {
    // Get user
    this.userService.getUserInfo().subscribe({
      next: (item: UserResponseProps) => {
        // Extract profile picture
        this.userIcon = item.user.profile_picture;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  logOut(): void {
    // Logout user and toggle menu
    this.userService.logOut();
    this.toggleSwitcher();
    this.router.navigate(['login']);
  }

  toggleSwitcher(): void {
    // Toggle menu
    this.menu = !this.menu;
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Detect if user has scrolled down
    this.isScrolled = window.scrollY > 0;
  }

  redirectToProfile() {
    // Navigate to profile page
    this.router.navigate(['myprofile']);
  }

  // show the active route
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
