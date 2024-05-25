import { Component, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ProjectsHttpService } from '../services/projects-http.service';
import { Phase } from '../../interfaces/phase';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user';
import { Task } from '../../interfaces/task';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, LoadingSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    protected userProjects!: Project[];
    protected selectedProjectId!: any;
    protected selectedProject!: Project;
    protected isLoading: boolean = false;
    protected timeMode: 'current' | 'past' = 'current';
    protected viewMode: 'phases' | 'tasks' = 'tasks';
    private userRole!: string | undefined;
    private sessionUser!: User;

    constructor(
        private route: ActivatedRoute,
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.sessionUser = this.authService.getSessionUser();
        this.userProjects = this.route.snapshot.data['projects'];
        console.log(this.userProjects);
        //Hacemos que el proyecto seleccionado sea el primero de la lista (lo convertimos a string para que quede seleccionado)
        this.selectedProjectId = this.userProjects[0].id + '';
        this.selectedProject = this.userProjects[0];
        this.userRole = this.selectedProject.project_user?.role;
        this.isLoading = true;
        this.projectHttpService.getHomeProjectDetails(this.selectedProjectId, this.userRole, this.sessionUser.email).subscribe(
            {
                next: (response: any) => {
                    if (response[0].Phase) {
                        this.selectedProject.Tasks = response;
                    } else {
                        this.selectedProject.Phases = response;
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
        // Cuando no tenga cargadas las fases del proyecto, se cargarán indicándole al usuario que se están cargando
        if (!this.selectedProject.Phases) {
            this.isLoading = true;
            this.projectHttpService.getHomeProjectDetails(this.selectedProjectId, this.userRole, this.sessionUser.email).subscribe(
                {
                    next: (response: any) => {
                        if (response[0].Phase) {
                            /*
                            Cuando la respuesta tenga como atributo "Phase" será porque el usuario es un desarrollador
                            y se habrán cargado las tareas del proyecto con su fase asociada
                             */
                            this.selectedProject.Tasks = response;
                        } else {
                            this.selectedProject.Phases = response;
                        }
                        // this.selectedProject.Phases = projectPhases;
                        console.log(this.selectedProject);
                        this.isLoading = false;
                    },
                    error: () => {
                        this.isLoading = false;
                    }
                }
            );
        }
    }
}
