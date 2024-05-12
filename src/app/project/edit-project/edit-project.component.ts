import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProjectUserHttpService } from '../../services/project-user-http.service';

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
    private userEmail: string = '';
    private userRole: string = '';

    constructor(
        private projectHttpService: ProjectsHttpService,
        private route: ActivatedRoute,
        private authService: AuthService
    ) { }


    ngOnInit(): void {
        this.userEmail = this.authService.getSessionUser().email;
        this.userRole = this.route.snapshot.data['role'];

    }

    editProject() {

    }

}
