import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BoardElementsService } from '../../../shared/services/board-elements.service';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board-element-toolbar',
  standalone: true,
  templateUrl: './board-element-toolbar.component.html',
  imports: [CommonModule, MatToolbarModule, MatFormFieldModule, MatInputModule],
})
export class BoardElementToolbarComponent {
  readonly boardElementsService = inject(BoardElementsService);
  readonly boardService = inject(BoardService);

  readonly activeElement = computed(() =>
    this.boardElementsService.elements().find((element) => element.isActive),
  );

  onChange(event: Event) {
    const activeElement = this.activeElement();

    if (!activeElement) return;

    const { name, value, type } = event.target as HTMLInputElement;
    console.log(value);

    this.boardElementsService.updateElementOptions(activeElement.id, {
      [name]: type === 'number' ? Number(value) : value,
    });
  }
}
