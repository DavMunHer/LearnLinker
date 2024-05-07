import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';

@Component({
    selector: 'app-project-details',
    standalone: true,
    imports: [],
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
    protected project: Project = {
        name: '',
        start_date: '',
        end_date: ''
    }

    constructor(private projectHttpService: ProjectsHttpService) { }

    ngOnInit(): void {
        // this.project = this.projectHttpService.
    }
}
