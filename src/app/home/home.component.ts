import { Component, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project';
import { AuthService } from '../services/auth.service';
import { UsersHttpService } from '../services/users-http.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    protected userProjects!: Project[];
    protected selectedProjectId!: any;
    protected selectedProject!: Project;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.userProjects = this.route.snapshot.data['projects'];
        //Hacemos que el proyecto seleccionado sea el primero de la lista (lo convertimos a string para que quede seleccionado)
        this.selectedProjectId = this.userProjects[0].id + '';
        console.log(this.userProjects);
        console.log(this.selectedProjectId);
    }


    loadProject(): void {
        console.log(this.selectedProjectId);
        this.selectedProject = this.userProjects.find(project => project.id == this.selectedProjectId)!;
        console.log(this.selectedProject);
    }
}
