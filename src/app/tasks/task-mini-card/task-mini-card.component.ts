import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { TasksHttpService } from '../../services/tasks-http.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-mini-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './task-mini-card.component.html',
  styleUrl: './task-mini-card.component.scss'
})
export class TaskMiniCardComponent {
    @Input() task!: any;
    @Input() phaseId!: number | undefined;
    @Input() projectId!: string;
    @Output() taskDeletion = new EventEmitter<Task>();

    constructor(private taskHttpService: TasksHttpService) {}

    deleteTask() {
        if (confirm('Are you sure you want to delete the task "'+ this.task.name +'"?')) {
            this.taskHttpService.deleteTask(this.task.id).subscribe({
                next: () => {
                    this.taskDeletion.emit(this.task);
                },
                error: (error) => {
                    console.error('Error deleting task', error);
                }
            });
        }
    }
}
