import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { FormsModule } from '@angular/forms';
import { TasksHttpService } from '../../services/tasks-http.service';
import { HelperService } from '../../services/helper.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-create-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-task.component.html',
    styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent implements OnInit {
    @Output() taskCreation = new EventEmitter<Task>();
    @Input() phaseId!: any;
    @Input() projectId!: any;

    private sessionUser!: any;
    protected task: Task = {
        name: '',
        start_date: '',
        deadline: '',
        description: '',
        phaseId: 0,
        users: [],
        projectId: 0
    }
    protected developerEmailOrUsername = '';

    protected errorMessage = '';


    constructor(
        private taskHttpService: TasksHttpService,
        private helper: HelperService,
        private authService: AuthService
    ) { }

    private handleError(error: HttpErrorResponse): string {
        let errorMessage = '';
        if (error.status == 404) {
            errorMessage = 'User not found!';
        } else {
            errorMessage = 'Internal server error.';
        }
        return errorMessage;
    }


    ngOnInit(): void {
        this.sessionUser = this.authService.getSessionUser();
    }


    async addUser() {
        this.errorMessage = await this.helper.checkAndAddTaskUser(this.developerEmailOrUsername, this.task.users, this.sessionUser, this.projectId, this.handleError);
        if (this.errorMessage == '') {
            this.developerEmailOrUsername = '';
        }
    }

    removeUser(username: any) {
        this.task.users = this.task.users.filter((user: any) => {
            return user.username !== username;
        });
    }

    sendAndCreateTask() {
        this.task.phaseId = this.phaseId;
        this.task.projectId = this.projectId;
        // this.taskCreation.emit(this.task);
        this.taskHttpService.createTask(this.task).subscribe({
            next: (response: Task) => {
                this.taskCreation.emit(response);
            },
            error: (error) => {
                console.log(error);
                this.errorMessage = this.handleError(error);
            }
        });
    }
}
