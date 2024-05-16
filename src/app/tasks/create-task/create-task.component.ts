import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-task.component.html',
    styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
    @Output() taskCreation = new EventEmitter<Task>();

    protected task: Task = {
        name: '',
        start_date: '',
        deadline: '',
    }

    sendTask() {
        this.taskCreation.emit(this.task);
    }
}
