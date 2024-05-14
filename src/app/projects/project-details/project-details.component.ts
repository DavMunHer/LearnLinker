import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { ActivatedRoute } from '@angular/router';

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
    constructor(private projectHttpService: ProjectsHttpService, private route: ActivatedRoute) { }


    ngOnInit(): void {
        this.projectHttpService.getProjectDetails('any', 'view', this.route.snapshot.params['id']).subscribe((response) => {
            this.project = response;
        });
    }
}
