import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './container.component.html',
})
export class ContainerComponent {}
