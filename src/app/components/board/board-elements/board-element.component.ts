import { Component, Input, inject } from '@angular/core';
import type { BoardElementDTO } from '../../../services/board-elements.service';
import { BoardElementsService } from '../../../services/board-elements.service';

@Component({
  selector: 'app-board-element',
  standalone: true,
  templateUrl: './board-element.component.html',
})
export class BoardElementComponent {
  readonly boardElementsService = inject(BoardElementsService);

  @Input({ required: true }) id!: BoardElementDTO['id'];
  @Input({ required: true }) options!: BoardElementDTO['options'];
}
