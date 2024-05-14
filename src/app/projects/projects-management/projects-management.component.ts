import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-projects-management',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './projects-management.component.html',
    styleUrl: './projects-management.component.scss'
})
export class ProjectsManagementComponent implements OnInit {
    protected userProjects: Project[] = [];

    constructor(private projectHttpService: ProjectsHttpService, private authService: AuthService) { }

    ngOnInit(): void {
        this.projectHttpService.getUserProjects(this.authService.getSessionUser().email).subscribe((response) => {
            this.userProjects = response;
        });
    }
    editProject(projectId: number) {
        console.log('editando');
    }
    deleteProject(projectId: number) {
        console.log('borrando');
    }


}
