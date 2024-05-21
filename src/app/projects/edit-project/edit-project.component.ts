import { Component, OnInit, Renderer2 } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperService } from '../../services/helper.service';
import { User } from '../../../interfaces/user';
import { CreatePhaseComponent } from '../../phases/create-phase/create-phase.component';
import { Phase } from '../../../interfaces/phase';
import { PhasesHttpService } from '../../services/phases-http.service';
import { CreateTaskComponent } from '../../tasks/create-task/create-task.component';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, RouterLink, CreatePhaseComponent, CreateTaskComponent, TaskListComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
    protected projectId: string;
    protected project: Project = {
        name: '',
        start_date: '',
        end_date: '',
        Users: [],
        Phases: []
    }
    protected userRole: string = '';
    protected leaderEmailOrUsername = '';
    protected phaseCreationMode: boolean = false;


    private sessionUser!: User;

    protected errorMessage = '';


    constructor(
        private projectHttpService: ProjectsHttpService,
        protected route: ActivatedRoute,
        private authService: AuthService,
        private helper: HelperService,
        private phaseHttpService: PhasesHttpService
    ) {
        this.projectId = this.route.snapshot.params['id'];
    }


    private handleError(error: HttpErrorResponse): string {
        let errorMessage = '';
        if (error.status == 404) {
            // Ponemos el mensaje de error del servidor dado que puede no encontrar el proyecto o el usuario
            errorMessage = error.error.message;
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
                console.log(this.project);
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

    removeUser(username: any) {
        this.project.Users = this.project.Users!.filter((storedUser: any) => {
            return storedUser.username != username;
        });
    }

    editProject() {
        if (this.project.Users) {
            this.projectHttpService.updateProject(this.project, this.route.snapshot.params['id']).subscribe();
        }
    }

    async addUser() {
        this.errorMessage = await this.helper.checkAndAddProjectUser(this.leaderEmailOrUsername, this.project.Users!, this.sessionUser, this.handleError);
        if (this.errorMessage == '') {
            this.leaderEmailOrUsername = '';
        }
    }

    togglePhaseCreation() {
        this.phaseCreationMode ? this.phaseCreationMode = false : this.phaseCreationMode = true;
    }

    savePhase(phase: Phase) {
        this.project.Phases!.push(phase);
        this.phaseCreationMode = false;
    }

    deletePhase(phase: Phase) {
        // Eliminamos la fase en local
        this.project.Phases = this.project.Phases!.filter((storedPhase: Phase) => {
            return storedPhase != phase;
        });
        // Eliminamos la fase en el servidor
        this.phaseHttpService.deletePhase(phase.id!).subscribe();
    }

    toggleTaskCreation(phase: Phase) {
        phase.taskCreationMode ? phase.taskCreationMode = false : phase.taskCreationMode = true;
    }

    saveTask(task: any, phase: Phase) {
        if (phase.Tasks) {
            phase.Tasks.push(task);
        } else {
            phase.Tasks = [task];
        }
        console.log(phase);
        console.log(this.project.Phases);
        phase.taskCreationMode = false;
    }

}
