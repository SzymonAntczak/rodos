import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BoardElementsService } from '../../services/board-elements.service';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board-element-toolbar',
  standalone: true,
  templateUrl: './board-element-toolbar.component.html',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class BoardElementToolbarComponent {
  readonly boardElementsService = inject(BoardElementsService);
  readonly boardService = inject(BoardService);

  readonly activeElement = computed(() =>
    this.boardElementsService.elements().find((element) => element.isActive),
  );

  onChange(event: Event): void {
    const activeElement = this.activeElement();

    if (!activeElement) return;

    const { name, value, type } = event.target as HTMLInputElement;

    this.boardElementsService.updateElementOptions(activeElement.id, {
      [name]: type === 'number' ? Number(value) : value,
    });
  }

  onBoardSizeFormSubmit(e: SubmitEvent): void {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const realHeight = Number(formData.get('realHeight'));
    const realWidth = Number(formData.get('realWidth'));

    if (realHeight <= 0 || realWidth <= 0) throw new Error('Invalid size');

    const board = this.boardService.board();

    if (!board) {
      this.boardService.createBoard({
        realWidth,
        realHeight,
      });

      return;
    }

    this.boardService.updateBoard(board.id, { realHeight, realWidth });
  }
}
