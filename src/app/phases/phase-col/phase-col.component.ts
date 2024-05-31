import { Component, Input } from '@angular/core';
import { Phase } from '../../../interfaces/phase';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-phase-col',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './phase-col.component.html',
  styleUrl: './phase-col.component.scss'
})
export class PhaseColComponent {
    @Input() phase!: Phase;
}
