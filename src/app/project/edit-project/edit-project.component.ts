import { Component, OnInit, Renderer2 } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProjectUserHttpService } from '../../services/project-user-http.service';
import { response } from 'express';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HelperService } from '../../services/helper.service';
import { UsersHttpService } from '../../services/users-http.service';

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
        end_date: '',
        Users: null,
        Phases: null
    }
    protected userRole: string = '';
    protected leaderEmailOrUsername = '';

    private userEmail: string = '';

    protected errorMessage = '';
    protected leaderEmailErrorMessage = '';


    constructor(
        private projectHttpService: ProjectsHttpService,
        private userHttpService: UsersHttpService,
        private route: ActivatedRoute,
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
        this.userEmail = this.authService.getSessionUser().email;
        this.userRole = this.route.snapshot.data['role'];
        this.projectHttpService.getProjectDetails(this.userRole, 'edit', this.route.snapshot.params['id']).subscribe({
            next: (response) => {
                this.project = response;
                console.log(this.project);
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

    removeUserCall(event:any) {
        this.project.Users = this.helper.removeUser(event, this.project.Users);
    }

    checkUser() {
        this.leaderEmailErrorMessage = '';
        if (this.leaderEmailOrUsername != '') {
            this.userHttpService.checkExistingUser(this.leaderEmailOrUsername).subscribe({
                next: (userExists) => {
                    if (userExists && this.leaderEmailOrUsername != this.userEmail) {
                        if (!this.project.Users.includes(this.leaderEmailOrUsername)) {
                            this.helper.addUser(this.project.Users, this.leaderEmailOrUsername, this.renderer);
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

    editProject() {

    }

}
