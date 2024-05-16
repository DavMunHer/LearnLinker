import { Component, EventEmitter, Output } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { FormsModule } from '@angular/forms';
import { CreateTaskComponent } from '../../tasks/create-task/create-task.component';
import { Task } from '../../../interfaces/task';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';

@Component({
    selector: 'app-create-phase',
    standalone: true,
    imports: [FormsModule, CreateTaskComponent, TaskListComponent],
    templateUrl: './create-phase.component.html',
    styleUrl: './create-phase.component.scss'
})
export class CreatePhaseComponent {
    @Output() phaseCreation = new EventEmitter<Phase>();
    protected taskCreationMode: boolean = false;

    protected phase: Phase = {
        name: '',
        deadline: '',
        start_date: '',
        end_date: '',
        Tasks: []
    }

    sendPhase() {
        this.phaseCreation.emit(this.phase);
        this.phase = {
            name: '',
            deadline: '',
            start_date: '',
            end_date: '',
            Tasks: []
        }
    }

    toggleTaskCreation() {
        this.taskCreationMode ? this.taskCreationMode = false : this.taskCreationMode = true;
    }

    addTask(task: Task) {
        this.phase.Tasks?.push(task);
        this.taskCreationMode = false;
    }
}
