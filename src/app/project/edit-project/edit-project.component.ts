import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
    protected project: any = {
        name: '',
        start_date: '',
        end_date: ''
    }
    constructor(private projectHttpService: ProjectsHttpService, private route: ActivatedRoute) { }


    ngOnInit(): void {
        this.projectHttpService.getProject(this.route.snapshot.params['id']).subscribe((response) => {
            this.project = response;


            console.log(this.project);
            console.log(typeof this.project.start_date);
        });
    }

    editProject() {

    }

}
