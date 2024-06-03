import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { DatePipe } from '@angular/common';
import { TaskMiniCardComponent } from '../../tasks/task-mini-card/task-mini-card.component';
import { RouterLink } from '@angular/router';
import { PhasesHttpService } from '../../services/phases-http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-phase-card',
  standalone: true,
  imports: [DatePipe, TaskMiniCardComponent, RouterLink],
  templateUrl: './phase-card.component.html',
  styleUrl: './phase-card.component.scss'
})
export class PhaseCardComponent {
    @Input() phase!: Phase;
    @Input() projectId!: string;
    @Input() mode!: 'edit' | 'default';
    @Output() phaseDeletion = new EventEmitter<Phase>();
    @Output() phaseDeletionError = new EventEmitter<string>();
    private errorMessage = '';

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.errorMessage = 'Phase not found';
        } else {
            this.errorMessage = 'Internal server error.';
        }
    }

    constructor(private phaseHttpService: PhasesHttpService) { }

    deletePhase() {
        if (confirm('Are you sure you want to delete the phase "' + this.phase.name + '"?')) {
            this.phaseHttpService.deletePhase(this.phase.id).subscribe({
                next: () => {
                    this.phaseDeletion.emit(this.phase);
                },
                error: (error) => {
                    this.handleError(error);
                    this.phaseDeletionError.emit(this.errorMessage);
                }
            });
        }
    }

    removeTask(task: any) {
        this.phase.Tasks = this.phase.Tasks.filter(t => t.id !== task.id);
    }

}
