import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BoardElementsService } from '../../services/board-elements.service';
import { BoardService } from '../../services/board.service';

type Form = {
  description: string;
  inputs: {
    label: string;
    name: string;
    value?: number | null;
    max?: number;
    step?: string;
  }[];
};

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

  readonly positionForm = computed<Form>(() => {
    const activeElement = this.boardElementsService.activeElement();
    const board = this.boardService.board();

    return {
      description: 'Położenie [m]',
      inputs: [
        {
          label: 'Od lewej',
          name: 'left',
          value: activeElement?.options.left,
          max: board?.realWidth,
        },
        {
          label: 'Od prawej',
          name: 'right',
          value: activeElement?.options.right,
          max: board?.realWidth,
        },
        {
          label: 'Od góry',
          name: 'top',
          value: activeElement?.options.top,
          max: board?.realHeight,
        },
        {
          label: 'Od dołu',
          name: 'bottom',
          value: activeElement?.options.bottom,
          max: board?.realHeight,
        },
      ],
    };
  });

  readonly sizeForm = computed<Form>(() => {
    const activeElement = this.boardElementsService.activeElement();
    const board = this.boardService.board();

    return {
      description: 'Wymiary [m]',
      inputs: [
        {
          label: 'Szerokość',
          name: 'width',
          value: activeElement?.options.width,
          max: board?.realWidth,
        },
        {
          label: 'Wysokość',
          name: 'height',
          value: activeElement?.options.height,
          max: board?.realHeight,
        },
      ],
    };
  });

  readonly layerForm = computed<Form>(() => {
    const activeElement = this.boardElementsService.activeElement();

    return {
      description: 'Warstwa',
      inputs: [
        {
          label: 'Warstwa',
          name: 'layer',
          value: activeElement?.options.layer,
          max: 10,
          step: '1',
        },
      ],
    };
  });

  onElementOptionChange(event: Event): void {
    const { name, value } = event.target as HTMLInputElement;

    switch (name) {
      case 'left': {
        this.boardElementsService.updateActiveElementOptions({
          [name]: Number(value),
          right: null,
        });
        break;
      }
      case 'right': {
        this.boardElementsService.updateActiveElementOptions({
          [name]: Number(value),
          left: null,
        });
        break;
      }
      case 'top': {
        this.boardElementsService.updateActiveElementOptions({
          [name]: Number(value),
          bottom: null,
        });
        break;
      }
      case 'bottom': {
        this.boardElementsService.updateActiveElementOptions({
          [name]: Number(value),
          top: null,
        });
        break;
      }
      default: {
        this.boardElementsService.updateActiveElementOptions({
          [name]: Number(value),
        });
      }
    }
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
