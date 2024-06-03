import { Component, Input, OnInit } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { PhasesHttpService } from '../../services/phases-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-phase',
  standalone: true,
  imports: [FormsModule, NgClass, PhaseCardComponent],
  templateUrl: './edit-phase.component.html',
  styleUrl: './edit-phase.component.scss'
})
export class EditPhaseComponent implements OnInit {
    protected projectId!: string;
    private phaseId!: string;
    protected phase!: Phase;
    protected minDate = new Date().toISOString().split('T')[0];
    protected errorMessage: string = '';


    constructor(
        private phaseHttpService: PhasesHttpService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.errorMessage = 'Phase not found';
        } else {
            this.errorMessage = 'Internal server error.'
        }
    }

    ngOnInit(): void {
        this.projectId = this.route.snapshot.params['projectId'];
        // console.log(this.projectId);
        this.phaseId = this.route.snapshot.params['phaseId'];
        this.phaseHttpService.getPhase(this.phaseId).subscribe({
            next: (phase: Phase) => {
                this.phase = phase;
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

    updatePhase() {
        this.phaseHttpService.updatePhase(this.phase.id, this.phase).subscribe({
            next: () => {
                this.errorMessage = '';
                this.router.navigate(['/edit-project', this.projectId]);
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

    goBack() {
        this.router.navigate(['/edit-project', this.projectId]);
    }
}
