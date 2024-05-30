import { Component, Input } from '@angular/core';
import { Phase } from '../../../interfaces/phase';

@Component({
  selector: 'app-phase-col',
  standalone: true,
  imports: [],
  templateUrl: './phase-col.component.html',
  styleUrl: './phase-col.component.scss'
})
export class PhaseColComponent {
    @Input() phase!: Phase;
}
