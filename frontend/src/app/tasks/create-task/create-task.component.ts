import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { FormsModule } from '@angular/forms';
import { TasksHttpService } from '../../services/tasks-http.service';
import { HelperService } from '../../services/helper.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AddedUserMiniCardComponent } from '../../others/added-user-mini-card/added-user-mini-card.component';

@Component({
    selector: 'app-create-task',
    standalone: true,
    imports: [FormsModule, NgClass, AddedUserMiniCardComponent],
    templateUrl: './create-task.component.html',
    styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent implements OnInit {
    // @Output() taskCreation = new EventEmitter<Task>();
    @Input() phaseId!: any;
    @Input() projectId!: any;
    protected minDate: string = new Date().toISOString().split('T')[0];

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
    protected developerErrorMessage = '';


    constructor(
        private taskHttpService: TasksHttpService,
        private helper: HelperService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
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
        this.phaseId = this.route.snapshot.params['phaseId'];
        this.projectId = this.route.snapshot.params['projectId'];
    }

    async addUser() {
        this.developerErrorMessage = await this.helper.checkAndAddTaskUser(this.developerEmailOrUsername, this.task.users, this.sessionUser, this.projectId, this.handleError);
        if (this.developerErrorMessage == '') {
            this.developerEmailOrUsername = '';
        }
    }

    removeUser(username: any) {
        this.task.users = this.task.users.filter((user: any) => {
            return user.username !== username;
        });
    }

    createTask() {
        this.task.phaseId = this.phaseId;
        this.task.projectId = this.projectId;
        // this.taskCreation.emit(this.task);
        this.taskHttpService.createTask(this.task).subscribe({
            next: () => {
                // this.taskCreation.emit(response);
                this.router.navigate(['/project', this.projectId, 'phase', this.phaseId, 'edit']);
            },
            error: (error) => {
                console.log(error);
                this.errorMessage = this.handleError(error);
            }
        });
    }
}
