import { Component, Input, OnInit } from '@angular/core';
import { TaskCardComponent } from '../../others/task-card/task-card.component';
import { Task } from '../../../interfaces/task';
import { TasksHttpService } from '../../services/tasks-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
    protected task!: Task;
    protected errorMessage!: string;

    constructor(
        private taskHttpService: TasksHttpService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) { }

    private handleError(error:  HttpErrorResponse) {
        if (error.status === 404) {
            // En este caso no se habrá encontrado la tarea para el usuario, por lo que no se le permitirá ver el componente
            this.router.navigate(['/home']);
        } else {
            this.errorMessage = 'Internal server error.';
        }
    }

    ngOnInit(): void {
        this.taskHttpService.getTaskDetails(this.route.snapshot.params['id'], this.authService.getSessionUser().email).subscribe({
            next: (response: Task) => {
                this.task = response;
            },
            error: (error) => {
                this.handleError(error);
            }
        })
    }

}
