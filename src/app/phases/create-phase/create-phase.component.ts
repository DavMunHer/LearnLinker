import { Component, EventEmitter, Output } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-phase',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-phase.component.html',
    styleUrl: './create-phase.component.scss'
})
export class CreatePhaseComponent {
    @Output() phaseCreation = new EventEmitter<Phase>();
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
}
