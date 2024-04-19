import { Component } from '@angular/core';
import { BoardElementToolbarComponent } from '../board-element-toolbar/board-element-toolbar.component';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [BoardComponent, BoardElementToolbarComponent],
  templateUrl: './container.component.html',
})
export class ContainerComponent {}
