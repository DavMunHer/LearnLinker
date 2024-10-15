import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { RouterLink } from '@angular/router';
import { Project } from '../../../interfaces/project';
import { PhasesHttpService } from '../../services/phases-http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-phase-col',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './phase-col.component.html',
  styleUrl: './phase-col.component.scss'
})
export class PhaseColComponent {
    @Input() phase!: Phase;
    @Input() project!: Project;
    protected dropdownView: boolean = false;
    @Output() phaseDeletion = new EventEmitter<Phase>();
    @Output() phaseDeletionError = new EventEmitter<string>();
    private errorMessage: string = '';

    constructor(private phaseHttpService: PhasesHttpService) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.errorMessage = 'Phase not found';
        } else {
            this.errorMessage = 'Internal server error.';
        }
    }

    toggleDropdown() {
        this.dropdownView ? this.dropdownView = false : this.dropdownView = true;
    }

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

}
