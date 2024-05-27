import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TaskUserHttpService {

  constructor(private http: HttpClient) { }

    updateTaskStatus(taskId: string, userEmail: string, task: Task): Observable<void> {
        return this.http.patch<void>(`task/${taskId}/user/${userEmail}`, task);
    }
}
