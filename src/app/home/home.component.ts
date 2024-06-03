import { Component, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ProjectsHttpService } from '../services/projects-http.service';
import { Phase } from '../../interfaces/phase';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user';
import { Task } from '../../interfaces/task';
import { TitleCasePipe } from '@angular/common';
import { TaskCardComponent } from '../others/task-card/task-card.component';
import { PhaseColComponent } from '../phases/phase-col/phase-col.component';
import { taskGuard } from '../guards/task.guard';
import { ProjectDataService } from '../services/project-data.service';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        LoadingSpinnerComponent,
        TitleCasePipe,
        TaskCardComponent,
        PhaseColComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    protected userProjects!: Project[];
    protected selectedProjectId!: any;
    protected selectedProject!: Project;
    protected isLoading: boolean = false;
    protected timeMode: 'current' | 'past' | 'all' = 'all';
    protected viewMode: 'phases' | 'tasks' = 'tasks';
    private userRole!: string | undefined;
    private sessionUser!: User;
    private selectedProjectPhasesCopy!: Phase[];

    //Variables para cambiar el formato dependiendo de lo que seleccione el usuario
    protected selectedProjectTasks: Task[] = [];
    protected selectedProjectPhases: Phase[] = [];

    constructor(
        private route: ActivatedRoute,
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService,
        private projectDataService: ProjectDataService
    ) { }


    private changeToTasksFormat(phases: Phase[]) {
        let tasks: any[] = [];
        let taskCounter = 0;
        for (const phase of phases) {
            if (phase.Tasks) {
                for (let j = 0; j < phase.Tasks.length; j++) {
                    tasks[taskCounter] = phase.Tasks[j];
                    tasks[taskCounter].Phase = {
                        id: phase.id,
                        name: phase.name,
                        start_date: phase.start_date,
                        end_date: phase.end_date,
                        deadline: phase.deadline,
                    };
                    taskCounter++;
                }
            }
        }
        return tasks;

    }

    private changeToPhasesFormat(tasks: Task[]) {
        let phases: any[] = [];
        let phasesMap = new Map<number, any>(); // Mapa para rastrear fases por ID

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const phaseId = task.Phase?.id;

            if (phaseId !== undefined) {
                if (!phasesMap.has(phaseId)) {
                    // Si la fase no está en el mapa, la añadimos
                    const phase = { ...task.Phase, Tasks: [] };
                    phasesMap.set(phaseId, phase);
                    phases.push(phase);
                }

                // Añadimos la tarea a la fase correspondiente
                phasesMap.get(phaseId).Tasks.push(task);
            }
        }

        return phases;
    }

    private resetProjectInfo(newProject: Project) {
        this.selectedProjectPhases = [];
        this.selectedProjectTasks = [];
        this.selectedProjectPhasesCopy = [];
        this.userRole = newProject.project_user?.role;
    }

    ngOnInit(): void {
        this.sessionUser = this.authService.getSessionUser();
        this.userProjects = this.route.snapshot.data['projects'];
        // console.log(this.userProjects);
        if (this.projectDataService.getProjectId()) {
            // Cuando haya información guardada será porque se ha pasado desde project management
            this.selectedProjectId = this.projectDataService.getProjectId() + '';
            this.projectDataService.clearprojectId();
            this.loadProject();
        } else {
//Hacemos que el proyecto seleccionado sea el primero de la lista (lo convertimos a string para que quede seleccionado)
            this.selectedProjectId = this.userProjects[0].id + '';
            this.selectedProject = this.userProjects[0];
        }
        this.userRole = this.selectedProject.project_user?.role;
        this.isLoading = true;
        this.projectHttpService.getHomeProjectDetails(this.selectedProjectId, this.userRole, this.sessionUser.email).subscribe(
            {
                next: (response: any) => {
                    if (response[0] && response[0].Phase) {
                        this.viewMode = 'tasks';
                        this.selectedProjectTasks = response;
                        // console.log(this.selectedProjectTasks);
                        // this.selectedProject.Tasks = response;
                    } else {
                        this.viewMode = 'phases';
                        this.selectedProjectPhases = response;
                        // console.log(this.selectedProjectPhases);
                        // this.selectedProject.Phases = response;
                    }
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                }
            }
        );
    }

    // Función para cargar el proyecto seleccionado
    loadProject(): void {
        this.selectedProject = this.userProjects.find(project => project.id == this.selectedProjectId)!;
        this.resetProjectInfo(this.selectedProject);
        // Cuando no tenga cargadas las fases del proyecto, se cargarán indicándole al usuario que se están cargando
        if (!this.selectedProject.Phases) {
            this.isLoading = true;
            this.projectHttpService.getHomeProjectDetails(this.selectedProjectId, this.userRole, this.sessionUser.email).subscribe(
                {
                    next: (response: any) => {
                        if (response[0] && response[0].Phase) {
                            /*
                            Cuando la respuesta tenga como atributo "Phase" será porque el usuario es un desarrollador
                            y se habrán cargado las tareas del proyecto con su fase asociada
                             */
                            this.viewMode = 'tasks';
                            this.selectedProjectTasks = response;
                            // console.log(this.selectedProjectTasks);

                            // this.selectedProject.Tasks = response;
                        } else {
                            this.viewMode = 'phases';
                            this.selectedProjectPhases = response;
                            // this.selectedProject.Phases = response;
                        }
                        // this.selectedProject.Phases = projectPhases;
                        // console.log(this.selectedProject);
                        this.isLoading = false;
                    },
                    error: () => {
                        this.isLoading = false;
                    }
                }
            );
        }
    }


    loadView() {
        if (this.viewMode === 'phases') {

            if (this.selectedProjectPhasesCopy.length > 0)
                this.selectedProjectPhases = this.selectedProjectPhasesCopy;
            else
                this.selectedProjectPhases = this.changeToPhasesFormat(this.selectedProjectTasks);

            this.selectedProjectTasks = [];
        // console.log(this.selectedProjectPhases);
        } else {
            this.selectedProjectTasks = this.changeToTasksFormat(this.selectedProjectPhases);
            /*
            Hacemos una copia de las fases para que en el caso en el que
            las fases no tuviesen ninguna tarea que no se pierda la información de
            dichas fases
             */
            this.selectedProjectPhasesCopy = [...this.selectedProjectPhases];
            this.selectedProjectPhases = [];
        }
    }
}
