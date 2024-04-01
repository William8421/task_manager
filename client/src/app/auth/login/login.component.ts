import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResponseProps } from 'src/types/userTypes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  hide = false;
  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(private userService: UserService, private router: Router) {
    // Subscribe to the isLoggedIn$ Observable to update isLoggedIn value
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit(): void {
    // if user logged in Redirect to home
    if (this.isLoggedIn) {
      this.router.navigate(['']);
    }
    // focus email input on in it
    setTimeout(() => {
      if (this.emailInput) {
        this.emailInput.nativeElement.focus();
      }
    });
  }

  errorMessage = '';

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      // Check if login form is valid
      this.userService.signIn(loginForm.value).subscribe({
        next: (item: UserResponseProps) => {
          const { user, token } = item;
          // Create user object
          const userStorage = {
            username: user.username,
            token: token,
            id: user.user_id,
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
      // login form error
      this.errorMessage = 'Email and Password are required to log in';
    }
  }

  RedirectRegister() {
    // if user not registered Navigate to register page
    this.router.navigate(['signup']);
  }
}
