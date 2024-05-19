import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { FormsModule } from '@angular/forms';
import { TasksHttpService } from '../../services/tasks-http.service';

@Component({
    selector: 'app-create-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-task.component.html',
    styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
    @Output() taskCreation = new EventEmitter<Task>();
    @Input() phaseId!: any;
    protected task: Task = {
        name: '',
        start_date: '',
        deadline: '',
        phaseId: 0
    }

    constructor(private taskHttpService: TasksHttpService) {

    }

    sendAndCreateTask() {
        this.task.phaseId = this.phaseId;
        this.taskCreation.emit(this.task);
        this.taskHttpService.createTask(this.task).subscribe();
    }

}
