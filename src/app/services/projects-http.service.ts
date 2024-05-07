import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../../interfaces/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsHttpService {

    constructor(private http: HttpClient) { }

    getProject(id: number): Observable<Project> {
        return this.http.get<Project>(``);
    }

    sendProject(project: Project): Observable<Project> {
        return this.http.post<Project>(`create/project`, project);
    }


}
