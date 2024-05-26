import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../../interfaces/task';
import { DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, DatePipe, MatProgressBarModule, RouterLink],
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
    @Input() task!: Task;

    getProgressValue() {
        return (this.task?.completedUsersInTask ?? 0) / (this.task?.totalUsersInTask ?? 1) * 100 + '';
    }
}
