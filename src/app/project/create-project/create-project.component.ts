import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-create-project',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-project.component.html',
    styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
    protected newProject: Project = {
        name: '',
        start_date: '',
        end_date: '',
        user_email: ''
    }

    constructor(private projectHttpService: ProjectsHttpService, private authService: AuthService) { }

    ngOnInit(): void {
        this.newProject.user_email = this.authService.getSessionUser().email;
    }

    createProject() {
        console.log(this.newProject);
        this.projectHttpService.sendProject(this.newProject).subscribe();
    }
}
