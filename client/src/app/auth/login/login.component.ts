import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { UserResponseProps } from 'src/types/userTypes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  hide = false;
  errorMessage = '';
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
    // focus email input on init
    setTimeout(() => {
      if (this.emailInput) {
        this.emailInput.nativeElement.focus();
      }
    });
  }

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.userService.signIn(loginForm.value).subscribe({
        next: (item: UserResponseProps) => {
          const { user, token } = item;
          const userStorage = {
            username: user.username,
            token: token,
            id: user.user_id,
          };
          localStorage.setItem('user', JSON.stringify(userStorage));
          this.router.navigate(['tasks']);
        },
        error: (err) => {
          console.error(err);
          this.handleLoginError(err);
        },
      });
    } else {
      this.errorMessage = 'REQUIRED_FIELDS';
    }
  }

  private handleLoginError(err: any) {
    if (err.error.errors) {
      const errorMsg = err.error.errors[0].msg;
      if (errorMsg.includes('email')) {
        this.errorMessage = 'EMAIL_VALID_ERROR';
      } else {
        this.errorMessage = errorMsg;
      }
    } else {
      this.errorMessage = 'EMAIL_OR_PASSWORD_ERROR';
    }
  }

  RedirectRegister() {
    this.router.navigate(['signup']);
  }
}
