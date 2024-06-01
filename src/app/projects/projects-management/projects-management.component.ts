import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
    selector: 'app-projects-management',
    standalone: true,
    imports: [RouterLink, ProjectCardComponent],
    templateUrl: './projects-management.component.html',
    styleUrl: './projects-management.component.scss'
})
export class ProjectsManagementComponent implements OnInit {
    protected userProjects: Project[] = [];
    private errorMessage = '';
    constructor(private projectHttpService: ProjectsHttpService, private authService: AuthService) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.errorMessage = 'Project not found';
        } else if (error.status == 500) {
            this.errorMessage = 'Internal server error';
        }

    }

    ngOnInit(): void {
        this.projectHttpService.getUserProjects(this.authService.getSessionUser().email).subscribe((response) => {
            this.userProjects = response;
            console.log(this.userProjects);
        });
    }

    deleteProject(projectId: number) {
        if (confirm('Are you sure that you want to delete this project?')) {
            this.projectHttpService.deleteProject(projectId).subscribe({
                next: (response) => {
                    this.userProjects = this.userProjects.filter(project => {
                        return project.id != projectId;
                    });
                },
                error: (error) => {
                    this.handleError(error);
                    console.log(this.errorMessage);
                }
            });
        }
    }
}
