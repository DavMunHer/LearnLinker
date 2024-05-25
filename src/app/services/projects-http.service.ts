import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../../interfaces/project';
import { Observable } from 'rxjs';
import { Phase } from '../../interfaces/phase';

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
    // Usamos este endpoint para obtener los detalles de un proyecto para editarlo dependiendo del rol de usuario
    getProjectDetails(role: string, action: string, id: string): Observable<Project> {
        return this.http.get<Project>(`project/${role}/${action}/details/${id}`);
    }

    getHomeProjectDetails(id: string): Observable<Phase[]> {
        return this.http.get<Phase[]>(`project/${id}/details`);
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
