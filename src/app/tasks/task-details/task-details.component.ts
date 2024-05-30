import { Component, Input, OnInit } from '@angular/core';
import { TaskCardComponent } from '../../others/task-card/task-card.component';
import { Task } from '../../../interfaces/task';
import { TasksHttpService } from '../../services/tasks-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../interfaces/user';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe } from '@angular/common';
import { TaskUserHttpService } from '../../services/task-user-http.service';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NoteHttpService } from '../../services/note-http.service';
import {MatDividerModule} from '@angular/material/divider';


@Component({
  selector: 'app-task-details',
  standalone: true,
    imports: [
        MatCardModule, MatButtonModule, MatProgressBarModule, DatePipe,
        FormsModule, MatInputModule, MatFormFieldModule, MatDividerModule
    ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
    protected task!: Task;
    protected errorMessage!: string;
    protected userInfo!: User;
    protected taskNotes: any = [];
    private taskId = this.route.snapshot.params['id'];
    constructor(
        private taskHttpService: TasksHttpService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private taskUserHttp: TaskUserHttpService,
        private noteHttpService: NoteHttpService
    ) { }
    protected userNote = {
        date: '',
        summary: '',
        taskId: this.taskId,
        userEmail: '',
    };
    protected successMessage!: string;

    private handleTaskError(error:  HttpErrorResponse) {
        if (error.status === 404) {
            // En este caso no se habrá encontrado la tarea para el usuario, por lo que no se le permitirá ver el componente
            this.router.navigate(['/home']);
        } else {
            this.errorMessage = 'Internal server error.';
        }
    }

    private handleNotesError(error:  HttpErrorResponse) {
        if (error.status === 404) {
            // En este caso no se habrá encontrado la tarea para el usuario, por lo que no se le permitirá ver el componente
            this.errorMessage = 'No notes found for the current task.';
        } else {
            this.errorMessage = 'Internal server error.';
        }
    }

    ngOnInit(): void {
        this.userInfo = this.authService.getSessionUser();
        this.taskHttpService.getTaskDetails(this.taskId, this.userInfo.email).subscribe({
            next: (response: Task) => {
                this.task = response;
                console.log(this.task);
            },
            error: (error) => {
                this.handleTaskError(error);
            }
        })
        this.noteHttpService.getTaskNotes(this.taskId).subscribe({
            next: (response: any) => {
                this.taskNotes = response;
            },
            error: (error) => {
                this.handleNotesError(error);
            }
        });
    }

    getProgressValue() {
        return (this.task?.completedUsersInTask ?? 0) / (this.task?.totalUsersInTask ?? 1) * 100 + '';
    }

    markAsFinished() {
        this.task.completedUsersInTask = (this.task?.completedUsersInTask ?? 0) + 1;
        this.task.userCompleted = 1;
        this.taskUserHttp.updateTaskStatus(this.task.id!, this.userInfo.email, this.task).subscribe();
    }

    markAsUnfinished() {
        this.task.completedUsersInTask = (this.task?.completedUsersInTask ?? 0) - 1;
        this.task.userCompleted = 0;
        this.taskUserHttp.updateTaskStatus(this.task.id!, this.userInfo.email, this.task).subscribe();
    }

    addNote() {
        this.userNote.date = new Date().toISOString();
        this.userNote.userEmail = this.userInfo.email;
        this.noteHttpService.createNote(this.userNote).subscribe({
            next: () => {
                this.taskNotes.push(this.userNote);
                this.successMessage = 'Note added successfully.';
            },
            error: (error) => {
                this.errorMessage = 'Could\'nt create the note.';
            }
        });
    }

}
