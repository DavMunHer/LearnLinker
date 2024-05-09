import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../../interfaces/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsHttpService {

    constructor(private http: HttpClient) { }

    // El id es un string porque viene de la ruta
    getProject(id: string): Observable<Project> {
        return this.http.get<Project>(`project/${id}`);
    }

    // El id es un string porque viene de la ruta
    getProjectDetails(id: string): Observable<Project> {
        return this.http.get<Project>(`project-details/${id}`);
    }

    sendProject(project: Project): Observable<Project> {
        return this.http.post<Project>(`create/project`, project);
    }

    getUserProjects(userEmail: string): Observable<Project[]> {
        return this.http.get<Project[]>(`user/${userEmail}/projects`);
    }

}
