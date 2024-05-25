import { Component, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project';
import { AuthService } from '../services/auth.service';
import { UsersHttpService } from '../services/users-http.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ProjectsHttpService } from '../services/projects-http.service';
import { Phase } from '../../interfaces/phase';
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

    constructor(private route: ActivatedRoute, private projectHttpService: ProjectsHttpService) { }

    ngOnInit(): void {
        this.userProjects = this.route.snapshot.data['projects'];
        //Hacemos que el proyecto seleccionado sea el primero de la lista (lo convertimos a string para que quede seleccionado)
        this.selectedProjectId = this.userProjects[0].id + '';
        this.selectedProject = this.userProjects[0];
        this.isLoading = true;
        this.projectHttpService.getHomeProjectDetails(this.selectedProjectId).subscribe(
            {
                next: (projectPhases: Phase[]) => {
                    this.selectedProject.Phases = projectPhases;
                    console.log(this.selectedProject);
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
            this.projectHttpService.getHomeProjectDetails(this.selectedProjectId).subscribe(
                {
                    next: (projectPhases: Phase[]) => {
                        this.selectedProject.Phases = projectPhases;
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

    getProjectDetails(): void {
        console.log(this.selectedProject);
    }
}
