import { Component } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';

@Component({
    selector: 'app-create-project',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-project.component.html',
    styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {
    protected newProject: Project = {
        name: '',
        start_date: '',
        end_date: ''
    }

    constructor(private projectHttpService: ProjectsHttpService) { }

    createProject() {
        this.projectHttpService.sendProject(this.newProject).subscribe();
    }
}
