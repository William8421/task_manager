import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { UserResponseProps } from 'src/types/userTypes';
import { TranslateService } from '@ngx-translate/core';

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
  currentLang = 'en';

  constructor(
    private router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {
    // Subscribe to the isLoggedIn$ Observable from UserService to update isLoggedIn value
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userService.userIcon$.subscribe((userIcon) => {
      this.userIcon = userIcon;
    });
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
  }
  // If logged in fetch user
  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.getUser();
    }
  }

  getUser() {
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

  // Logout user and toggle menu
  logOut(): void {
    this.userService.logOut();
    this.toggleSwitcher(this.menu);
    this.router.navigate(['login']);
  }

  // Toggle menu
  toggleSwitcher(openMenu: boolean): void {
    this.menu = openMenu;
  }
  // Detect if user has scrolled down
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  // Navigate to profile page
  redirectToProfile() {
    this.router.navigate(['myprofile']);
  }

  // show the active route
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  // change app's language
  onLanguageChange(event: Event): void {
    const selectedLang = (event.target as HTMLSelectElement).value;
    this.currentLang = selectedLang;
    this.translate.use(selectedLang);
    localStorage.setItem('currentLang', selectedLang);
    this.toggleSwitcher(this.menu);
  }
}
