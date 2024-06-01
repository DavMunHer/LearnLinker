import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, NgClass, RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
    @Input() project!: Project;
    @Output() deleteProjectEvent = new EventEmitter<number>();
    @Output() errorOccurred = new EventEmitter<string>();

    private errorMessage = '';
    constructor(
        private projectHttpService: ProjectsHttpService,
        private projectDataService: ProjectDataService,
        private router: Router
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.errorMessage = 'Project not found';
        } else if (error.status == 500) {
            this.errorMessage = 'Internal server error';
        }
        this.errorOccurred.emit(this.errorMessage);
    }

    deleteProject(projectId: number) {
        if (confirm('Are you sure that you want to delete this project?')) {
            this.projectHttpService.deleteProject(projectId).subscribe({
                next: () => {
                    this.deleteProjectEvent.emit(projectId);
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
        }
    }

    redirectToHomeWithProjectData() {
        this.projectDataService.setProjectId(this.project.id);
        this.router.navigate(['/home']);
    }
}
