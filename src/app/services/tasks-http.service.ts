import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksHttpService {

    constructor(private http: HttpClient) { }

    createTask(task: any) {
        return this.http.post('create/task', task);
    }


}
