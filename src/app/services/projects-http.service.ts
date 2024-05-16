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
    getProjectDetails(role: string, action: string, id: string): Observable<Project> {
        return this.http.get<Project>(`project/${role}/${action}/details/${id}`);
    }

    createProject(request: any): Observable<Project> {
        return this.http.post<Project>(`create/project`, request);
    }

    getUserProjects(userEmail: string): Observable<Project[]> {
        return this.http.get<Project[]>(`user/${userEmail}/projects`);
    }

    updateProject(projectRequest: any, projectId: string) {
        return this.http.put(`update/project/${projectId}`, projectRequest);
    }

    deleteProject(projectId: number): Observable<void> {
        return this.http.delete<void>(`delete/project/${projectId}`);
    }

}
