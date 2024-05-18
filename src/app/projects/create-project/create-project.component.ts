import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperService } from '../../services/helper.service';
import { User } from '../../../interfaces/user';

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
    private sessionUser!: User;
    protected leaderEmailOrUsername = '';
    protected leaders: any[] = [];

    protected leaderEmailErrorMessage = '';
    protected errorMessage = '';
    protected successMessage = '';

    constructor(
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService,
        private helper: HelperService,
    ) { }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.status == 404) {
            errorMessage = 'There is no user with that email or username';
        } else if (error.status == 409) {
            errorMessage = 'You can\'t be the leader and the manager at the same time!';
        } else if (error.status == 400) {
            errorMessage = error.error.message;
        } else {
            errorMessage = 'An error has occurred';
        }
        return errorMessage;
    }

    ngOnInit(): void {
        this.sessionUser = this.authService.getSessionUser();
    }

    loadedLeader():boolean {
        return this.leaders.some((user: any) => {
            return user.email === this.leaderEmailOrUsername || user.username === this.leaderEmailOrUsername;
        })
    }

    async addUser() {
        this.errorMessage = await this.helper.checkAndAddUser(this.leaderEmailOrUsername, this.leaders, this.sessionUser, this.handleError);
        if (this.errorMessage === '') {
            this.leaderEmailOrUsername = '';
        }
    }

    removeUser(username: any) {
        this.leaders = this.leaders.filter((storedUser: any) => {
            return storedUser.username != username;
        });
    }

    sendProject() {
        this.leaderEmailErrorMessage = '';
        this.errorMessage = '';
        this.successMessage = '';

        this.projectHttpService.createProject({
            name: this.newProject.name,
            start_date: this.newProject.start_date,
            end_date: this.newProject.end_date,
            user_email: this.sessionUser.email,
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
