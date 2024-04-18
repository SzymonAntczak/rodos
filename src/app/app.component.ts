import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './modules/layout/components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {}
