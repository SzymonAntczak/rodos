import { Component } from '@angular/core';
import { BoardElementToolbarComponent } from './components/board-element-toolbar/board-element-toolbar.component';
import { BoardComponent } from './components/board/board.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, BoardComponent, BoardElementToolbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
