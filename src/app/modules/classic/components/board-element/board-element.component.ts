import { Component, Input, inject } from '@angular/core';
import {
  BoardElementsService,
  type BoardElementDTO,
} from '../../../shared/services/board-elements.service';

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
