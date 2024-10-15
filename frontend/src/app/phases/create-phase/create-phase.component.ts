import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { FormsModule } from '@angular/forms';
import { CreateTaskComponent } from '../../tasks/create-task/create-task.component';
import { Task } from '../../../interfaces/task';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { PhasesHttpService } from '../../services/phases-http.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-create-phase',
    standalone: true,
    imports: [FormsModule, CreateTaskComponent, TaskListComponent, NgClass],
    templateUrl: './create-phase.component.html',
    styleUrl: './create-phase.component.scss'
})
export class CreatePhaseComponent {
    @Output() phaseCreation = new EventEmitter<Phase>();
    @Input() projectId!: string;
    protected minDate: string = new Date().toISOString().split('T')[0]; // Formato para que no se pueda seleccionar una fecha anterior a la actual en el input

    protected phase: Phase = {
        name: '',
        deadline: '',
        start_date: '',
        end_date: '',
        Tasks: [],
    }

    constructor(private phaseService: PhasesHttpService) { }

    sendAndCreatePhase() {
        this.phaseService.createPhase(this.projectId, this.phase).subscribe({
            next: (phase: Phase) => {
                this.phaseCreation.emit(phase);
            },
            error: (error) => {
                console.error('Error creating phase', error);
            }
        });
        this.phase = {
            name: '',
            deadline: '',
            start_date: '',
            end_date: '',
            Tasks: []
        }
    }

    removeTask(task: Task) {
        this.phase.Tasks = this.phase.Tasks?.filter(t => t !== task);
    }
}
