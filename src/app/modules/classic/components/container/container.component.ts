import { Component } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { BoardElementToolbarComponent } from '../board-element-toolbar/board-element-toolbar.component';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [BoardComponent, BoardElementToolbarComponent],
  providers: [BoardService],
  templateUrl: './container.component.html',
})
export class ContainerComponent {}
