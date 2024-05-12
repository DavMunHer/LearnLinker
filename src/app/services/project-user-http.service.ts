import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectUserHttpService {

    constructor(private http: HttpClient) { }

    getRole(user_email: string, projectId: string): Observable<string> {
        return this.http.get<string>(`user/${user_email}/project/${projectId}`);
    }
}
