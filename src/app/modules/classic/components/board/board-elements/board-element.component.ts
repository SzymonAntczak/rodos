import { Component, Input, inject } from '@angular/core';
import type { BoardElement } from '../../../../shared/services/board-elements.service';
import { BoardElementsService } from '../../../../shared/services/board-elements.service';

@Component({
  selector: 'app-board-element',
  standalone: true,
  templateUrl: './board-element.component.html',
})
export class BoardElementComponent {
  readonly boardElementsService = inject(BoardElementsService);

  @Input({ required: true }) id!: BoardElement['id'];
  @Input({ required: true }) options!: BoardElement['options'];
}
