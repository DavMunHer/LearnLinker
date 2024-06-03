import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../interfaces/task';
import { TasksHttpService } from '../../services/tasks-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { AddedUserMiniCardComponent } from '../../others/added-user-mini-card/added-user-mini-card.component';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule, NgClass, AddedUserMiniCardComponent],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit{
    protected task!: any;
    private projectId!: string;
    private phaseId!: string;
    protected minDate: string = new Date().toISOString().split('T')[0];
    protected developerEmailOrUsername = '';
    protected developerErrorMessage = '';
    private sessionUser!: User;

    constructor(
        private taskHttpService: TasksHttpService,
        private route: ActivatedRoute,
        private router: Router,
        private helper: HelperService,
        private authService: AuthService
    ) { }

    private handleError(error: HttpErrorResponse): string {
        if (error.status == 404) {
            return 'User not found!';
        } else {
            return 'Internal server error.';
        }
    }

    ngOnInit(): void {
        this.projectId = this.route.snapshot.params['projectId'];
        this.phaseId = this.route.snapshot.params['phaseId'];
        this.sessionUser = this.authService.getSessionUser();
        this.taskHttpService.getTask(this.route.snapshot.params['taskId']).subscribe({
            next: (task: Task) => {
                this.task = task;
                console.log(this.task);
            },
            error: (error) => {
                console.error('Error getting task', error);
            }
        });
    }

    async addUser() {
        this.developerErrorMessage = await this.helper.checkAndAddTaskUser(this.developerEmailOrUsername, this.task.Users, this.sessionUser, this.projectId, this.handleError);
        if (this.developerErrorMessage == '') {
            this.developerEmailOrUsername = '';
        }
    }

    removeUser(username: string) {
        this.task.Users = this.task.Users.filter((user: any) => user.username !== username);
        this.developerEmailOrUsername = '';
    }


    updateTask() {
        this.taskHttpService.updateTask(this.task).subscribe({
            next: () => {
                this.router.navigate(['/project', this.projectId, 'phase', this.phaseId, 'edit']);
            },
            error: (error) => {
                console.error('Error updating task', error);
            }
        });
    }

}
