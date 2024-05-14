import { Component, OnInit, Renderer2 } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HelperService } from '../../services/helper.service';
import { UsersHttpService } from '../../services/users-http.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
    protected project: any = {
        name: '',
        start_date: '',
        end_date: '',
        Users: null,
        Phases: null
    }
    protected userRole: string = '';
    protected leaderEmailOrUsername = '';
    protected updatedUsers: any[] = [];

    private sessionUser!: User;

    protected errorMessage = '';
    protected leaderEmailErrorMessage = '';


    constructor(
        private projectHttpService: ProjectsHttpService,
        private userHttpService: UsersHttpService,
        protected route: ActivatedRoute,
        private authService: AuthService,
        private helper: HelperService,
        private renderer: Renderer2,
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.errorMessage = 'Project not found!';
        } else if (error.status == 403) {
            this.errorMessage = 'A developer cannot edit the project!';
        } else if (error.status == 401) {
            this.errorMessage = 'Unexpected role!';
        } else {
            this.errorMessage = 'Internal server error.';
        }
    }


    ngOnInit(): void {
        this.sessionUser = this.authService.getSessionUser();
        this.userRole = this.route.snapshot.data['role'];
        this.projectHttpService.getProjectDetails(this.userRole, 'edit', this.route.snapshot.params['id']).subscribe({
            next: (response) => {
                this.project = response;
                if (this.project.Users) {
                    this.updatedUsers = [...this.project.Users];
                }
                console.log(this.project);
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

    removeUserCall(event: any) {
        this.updatedUsers = this.helper.removeUser(event, this.updatedUsers);
    }

    private loadedUser(): boolean {
        return  this.updatedUsers.some((user: any) => {
            return user.email === this.leaderEmailOrUsername || user.username === this.leaderEmailOrUsername;
        })
    }

    checkUser() {
        this.leaderEmailErrorMessage = '';
        if (this.leaderEmailOrUsername != '') {
            this.userHttpService.checkExistingUser(this.leaderEmailOrUsername).subscribe({
                next: (user) => {
                    if (user && this.leaderEmailOrUsername != this.sessionUser.email && this.leaderEmailOrUsername != this.sessionUser.username) {
                        if (!this.loadedUser()) {
                            this.helper.addUser(this.updatedUsers, user, this.renderer);
                            console.log(this.updatedUsers);
                            this.leaderEmailOrUsername = '';
                        } else
                            this.leaderEmailErrorMessage = 'The user is already added in the project!';
                    }
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
        }

    }

    editProject() {
        if (this.project.Users) {
            this.project.Users = [...this.updatedUsers];
            this.projectHttpService.updateProject(this.project, this.route.snapshot.params['id']).subscribe();
        }
    }

}
