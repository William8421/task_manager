import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { DecodedTokenProps } from 'src/types/userTypes';
import { TaskProps, TaskResponseProps } from 'src/types/taskTypes';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  baseURL = 'http://35.156.80.110:8000';

  constructor(private http: HttpClient) {
    this.checkLoggedInStatus();
  }

  // Checks if the user is logged in by verifying the token
  private checkLoggedInStatus(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = userData && !this.isTokenExpired(userData.token);
    this.isLoggedInSubject.next(isLoggedIn);
  }

  // Checks if the token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: DecodedTokenProps = jwtDecode(token);
      return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  // Logs out the user
  logOut(): void {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  // get logged in user tasks
  getUserTasks(): Observable<TaskProps[]> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskProps[]>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http.post<TaskProps[]>(
      `${this.baseURL}/tasks/alltasks`,
      { user_id: userData.id },
      { headers }
    );
  }

  // get logged in user filtered tasks by status
  getFilteredTasksByStatus(status: string): Observable<TaskProps[]> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskProps[]>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http.post<TaskProps[]>(
      `${this.baseURL}/tasks/status/filter`,
      { user_id: userData.id, filter: status },
      { headers }
    );
  }

  // get logged in user filtered tasks by priority
  getFilteredTasksByPriority(priority: string): Observable<TaskProps[]> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskProps[]>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http.post<TaskProps[]>(
      `${this.baseURL}/tasks/priority/filter`,
      { user_id: userData.id, filter: priority },
      { headers }
    );
  }

  // get logged in user filtered tasks by status and priority
  getFilteredTasksByStatusAndPriority(
    statusFilter: string,
    priorityFilter: string
  ) {
    console.log('service', statusFilter, priorityFilter);

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskProps[]>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http.post<TaskProps[]>(
      `${this.baseURL}/tasks/status&priority/filter`,
      { user_id: userData.id, statusFilter, priorityFilter },
      { headers }
    );
  }

  searchTasksByTitle(title: string): Observable<TaskProps[]> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskProps[]>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http.post<TaskProps[]>(
      `${this.baseURL}/tasks/search`,
      { user_id: userData.id, title },
      { headers }
    );
  }

  // Creates a new task
  createTask(inputData: TaskProps): Observable<TaskResponseProps> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskResponseProps>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http.post<TaskResponseProps>(
      `${this.baseURL}/tasks/create`,
      { ...inputData, user_id: userData.id },
      { headers }
    );
  }

  // Updates a task
  updateTask(
    inputData: TaskProps,
    taskId: string
  ): Observable<TaskResponseProps> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskResponseProps>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    const taskData = { user_id: userData.id, task_id: taskId };

    return this.http
      .put<TaskProps>(
        `${this.baseURL}/tasks/task/update`,
        { ...taskData, ...inputData },
        { headers }
      )
      .pipe(
        map((response: TaskProps) => response as unknown as TaskResponseProps)
      );
  }

  // Deletes a task
  deleteTask(task_id: string): Observable<TaskResponseProps> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<TaskResponseProps>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    const taskData = { headers, body: { user_id: userData.id, task_id } };

    return this.http
      .delete<TaskProps>(`${this.baseURL}/tasks/delete`, {
        ...taskData,
      })
      .pipe(
        map((response: TaskProps) => response as unknown as TaskResponseProps)
      );
  }
}
