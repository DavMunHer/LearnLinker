import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';
import { UsersHttpService } from '../../services/users-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { response } from 'express';

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
    }
    protected userEmail = '';
    protected leaderEmailOrUsername = '';

    protected leaderEmailErrorMessage = '';
    protected errorMessage = '';
    protected successMessage = '';

    constructor(
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService,
        private userHttpService: UsersHttpService
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.leaderEmailErrorMessage = 'There is no user with that email or username';
        } else if(error.status == 409) {
            this.leaderEmailErrorMessage = 'You can\'t be the leader and the manager at the same time!';
        }
        else {
            this.errorMessage = 'An error has occurred';
        }
    }

    ngOnInit(): void {
        this.userEmail = this.authService.getSessionUser().email;
    }

    sendProject() {
        this.leaderEmailErrorMessage = '';
        this.errorMessage = '';
        this.successMessage = '';

        this.projectHttpService.createProject({
            name: this.newProject.name,
            start_date: this.newProject.start_date,
            end_date: this.newProject.end_date,
            user_email: this.userEmail,
            leader_email_or_username: this.leaderEmailOrUsername
        }).subscribe({
            error: (error) => {
                this.handleError(error);
            },
            complete: () => {
                this.successMessage = 'Projected created successfully!';
            }
        });
        // this.userHttpService.getUser(this.leaderEmail).subscribe({
        //     next: (response) => {
        //         if (this.leaderEmail == response.email && this.leaderEmail != this.newProject.user_email) {
        //             this.projectHttpService.createProject({
        //                 name: this.newProject.name,
        //                 start_date: this.newProject.start_date,
        //                 end_date: this.newProject.end_date,
        //                 user_email: this.userEmail,
        //                 leader_email: this.leaderEmail
        //             }).subscribe();
        //         }
        //     },
        //     error: (error) => {
        //         this.handleError(error);
        //     }
        // })
    }
}
