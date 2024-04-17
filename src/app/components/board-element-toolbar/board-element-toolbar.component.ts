import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import type { BoardElement } from '../../services/board-elements.service';
import { BoardElementsService } from '../../services/board-elements.service';

@Component({
  selector: 'app-board-element-toolbar',
  standalone: true,
  templateUrl: './board-element-toolbar.component.html',
  imports: [MatToolbarModule, FormsModule, MatFormFieldModule, MatInputModule],
})
export class BoardElementToolbarComponent {
  readonly boardElementsService = inject(BoardElementsService);

  readonly activeElement = computed<BoardElement | undefined>(() =>
    this.boardElementsService.elements().find((element) => element.isActive),
  );
}
