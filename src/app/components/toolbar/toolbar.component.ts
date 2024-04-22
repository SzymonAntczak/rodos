import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {
  BoardElementsService,
  type BoardElementDTO,
} from '../../services/board-elements.service';

interface MenuItem {
  category: 'subsoil';
  icon: string;
  boardElements: {
    label: string;
    componentType: BoardElementDTO['type'];
  }[];
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
  ],
})
export class ToolbarComponent {
  readonly title = 'Rodos';
  readonly boardElementsService = inject(BoardElementsService);

  readonly menuItems: MenuItem[] = [
    {
      category: 'subsoil',
      icon: 'yard',
      boardElements: [
        {
          label: 'Trawa',
          componentType: 'grass',
        },
        {
          label: 'Płyta betonowa',
          componentType: 'concreteSlab',
        },
      ],
    },
  ];
}
