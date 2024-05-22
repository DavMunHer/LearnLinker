import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TasksHttpService {

    constructor(private http: HttpClient) { }

    createTask(task: any): Observable<Task> {
        return this.http.post<Task>('create/task', task);
    }

    deleteTask(taskId: string) {
        return this.http.delete(`delete/task/${taskId}`);
    }
}
