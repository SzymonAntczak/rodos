import { NgComponentOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BoardElementsService } from '../../services/board-elements.service';
import { BoardElementComponent } from './board-elements/board-element.component';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  imports: [NgComponentOutlet, BoardElementComponent],
})
export class BoardComponent {
  readonly boardElementsService = inject(BoardElementsService);
}
