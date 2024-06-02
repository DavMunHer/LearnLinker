import { Component, Input } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { DatePipe } from '@angular/common';
import { TaskMiniCardComponent } from '../../tasks/task-mini-card/task-mini-card.component';
import { RouterLink } from '@angular/router';

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

    deletePhase() {

    }
}
