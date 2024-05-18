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
import { CreatePhaseComponent } from '../../phases/create-phase/create-phase.component';
import { Phase } from '../../../interfaces/phase';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, RouterLink, CreatePhaseComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
    protected projectId: string;
    protected project: any = {
        name: '',
        start_date: '',
        end_date: '',
        Users: null,
        Phases: null
    }
    protected userRole: string = '';
    protected leaderEmailOrUsername = '';
    // protected updatedUsers: any[] = [];
    protected phaseCreationMode: boolean = false;


    private sessionUser!: User;

    protected errorMessage = '';
    // protected leaderEmailErrorMessage = '';


    constructor(
        private projectHttpService: ProjectsHttpService,
        private userHttpService: UsersHttpService,
        protected route: ActivatedRoute,
        private authService: AuthService,
        private helper: HelperService,
    ) {
        this.projectId = this.route.snapshot.params['id'];
    }


    private handleError(error: HttpErrorResponse): string {
        let errorMessage = '';
        if (error.status == 404) {
            errorMessage = 'Project not found!';
        } else if (error.status == 403) {
            errorMessage = 'A developer cannot edit the project!';
        } else if (error.status == 401) {
            errorMessage = 'Unexpected user role!';
        } else {
            errorMessage = 'Internal server error.';
        }
        return errorMessage;
    }


    ngOnInit(): void {
        this.sessionUser = this.authService.getSessionUser();
        this.userRole = this.route.snapshot.data['role'];
        this.projectHttpService.getProjectDetails(this.userRole, 'edit', this.route.snapshot.params['id']).subscribe({
            next: (response) => {
                this.project = response;
                // if (this.project.Users) {
                //     this.updatedUsers = [...this.project.Users];
                // }
                console.log(this.project);
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

    removeUser(username: any) {
        // this.updatedUsers = this.helper.removeUser(event, this.updatedUsers);
        this.project.Users = this.project.Users.filter((storedUser: any) => {
            return storedUser.username != username;
        });
    }

    async addUser() {
        this.errorMessage = await this.helper.checkAndAddUser(this.leaderEmailOrUsername, this.project.Users, this.sessionUser, this.handleError);
        if (this.errorMessage == '') {
            this.leaderEmailOrUsername = '';
        }
    }

    togglePhaseCreation() {
        this.phaseCreationMode ? this.phaseCreationMode = false : this.phaseCreationMode = true;
    }

    savePhase(phase: Phase) {
        this.project.Phases.push(phase);
    }

    deletePhase(phase: Phase) {
        this.project.Phases = this.project.Phases.filter((storedPhase: Phase) => {
            return storedPhase != phase;
        });
    }

    editProject() {
        if (this.project.Users) {
            // this.project.Users = [...this.updatedUsers];
            this.projectHttpService.updateProject(this.project, this.route.snapshot.params['id']).subscribe();
        }
    }

}
