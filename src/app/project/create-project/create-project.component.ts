import { Component, OnInit, Renderer2 } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';
import { UsersHttpService } from '../../services/users-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { response } from 'express';
import { HelperService } from '../../services/helper.service';

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
    protected leaders: string[] = [];

    protected leaderEmailErrorMessage = '';
    protected errorMessage = '';
    protected successMessage = '';

    constructor(
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService,
        private userHttpService: UsersHttpService,
        private helper: HelperService,
        private renderer: Renderer2
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.leaderEmailErrorMessage = 'There is no user with that email or username';
        } else if (error.status == 409) {
            this.leaderEmailErrorMessage = 'You can\'t be the leader and the manager at the same time!';
        } else if (error.status == 400) {
            this.errorMessage = error.error.message;
        }
        else {
            this.errorMessage = 'An error has occurred';
        }
    }

    ngOnInit(): void {
        this.userEmail = this.authService.getSessionUser().email;
    }


    checkUser() {
        this.leaderEmailErrorMessage = '';
        if (this.leaderEmailOrUsername != '') {
            this.userHttpService.checkExistingUser(this.leaderEmailOrUsername).subscribe({
                next: (userExists) => {
                    if (userExists && this.leaderEmailOrUsername != this.userEmail) {
                        if (!this.leaders.includes(this.leaderEmailOrUsername)) {
                            console.log(this.leaders);
                            this.helper.addUser(this.leaders, this.leaderEmailOrUsername, this.renderer);
                            console.log(this.leaders);
                            this.leaderEmailOrUsername = '';
                        } else
                            this.leaderEmailErrorMessage = 'The user is already added as leader!';
                    }
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
        }

    }

    removeUserCall(event: any) {
        this.leaders = this.helper.removeUser(event, this.leaders);
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
            leaders: this.leaders
        }).subscribe({
            error: (error) => {
                this.handleError(error);
            },
            complete: () => {
                this.successMessage = 'Projected created successfully!';
            }
        });
    }
}
