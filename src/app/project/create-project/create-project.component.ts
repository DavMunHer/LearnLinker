import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';
import { UsersHttpService } from '../../services/users-http.service';
import { HttpErrorResponse } from '@angular/common/http';

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
        user_email: '',
    }
    protected leaderEmail = '';
    protected userNotFoundErrorMessage = '';
    protected errorMessage = '';

    constructor(
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService,
        private userHttpService: UsersHttpService
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.userNotFoundErrorMessage = 'There is no user with that email or username';
        } else {
            this.errorMessage = 'An error has occurred';
        }
    }

    ngOnInit(): void {
        this.newProject.user_email = this.authService.getSessionUser().email;
    }

    createProject() {
        this.userHttpService.getUser(this.leaderEmail).subscribe({
            next: (response) => {
                if (this.leaderEmail == response.email && this.leaderEmail != this.newProject.user_email) {
                    this.projectHttpService.sendProject(this.newProject).subscribe();
                }
            },
            error: (error) => {
                this.handleError(error);
            }
        })
    }
}
