import { Component, Input } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, NgClass],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
    @Input() project!: Project;

}
