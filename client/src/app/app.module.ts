import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TasksComponent } from './tasks/tasks.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './user/profile/profile.component';
import { DeleteTaskModalComponent } from './tasks-modals/delete-task-modal/delete-task-modal.component';
import { UpdateTaskModalComponent } from './tasks-modals/update-task-modal/update-task-modal.component';
import { CreateTaskModalComponent } from './tasks-modals/create-task-modal/create-task-modal.component';
import { EditProfileModalComponent } from './user/edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from './user/change-password-modal/change-password-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskComponent } from './tasks/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TasksComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    DeleteTaskModalComponent,
    UpdateTaskModalComponent,
    CreateTaskModalComponent,
    EditProfileModalComponent,
    ChangePasswordModalComponent,
    TaskComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
