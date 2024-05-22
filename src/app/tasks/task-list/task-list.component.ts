import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { TasksHttpService } from '../../services/tasks-http.service';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
    @Input() taskList: Task[] = [];
    @Output() taskDeletion = new EventEmitter<Task[]>();

    constructor(private taskHttpService: TasksHttpService) { }

    deleteTask(task: Task) {
        this.taskHttpService.deleteTask(task.id!).subscribe({
            next: () => {
                this.taskList = this.taskList.filter((t: Task) => {
                    return task != t;
                });
                this.taskDeletion.emit(this.taskList);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}
