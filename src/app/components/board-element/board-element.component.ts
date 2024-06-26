import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  effect,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import {
  BoardElementsService,
  type BoardElementDTO,
} from '../../services/board-elements.service';
import { type ConcreteSlabComponent } from './subsoil/concrete-slab/concrete-slab.component';
import { type GrassComponent } from './subsoil/grass/grass.component';

type DynamicComponent = typeof GrassComponent | typeof ConcreteSlabComponent;

export const dynamicComponents = {
  grass: () =>
    import('./subsoil/grass/grass.component').then((m) => m.GrassComponent),
  concreteSlab: () =>
    import('./subsoil/concrete-slab/concrete-slab.component').then(
      (m) => m.ConcreteSlabComponent,
    ),
} satisfies Record<BoardElementDTO['type'], () => Promise<DynamicComponent>>;

@Component({
  selector: 'app-board-element',
  standalone: true,
  templateUrl: './board-element.component.html',
  imports: [CommonModule],
})
export class BoardElementComponent implements OnInit {
  @Input({ required: true }) boardElement!: BoardElementDTO;

  readonly dynamicComponent = signal<DynamicComponent | null>(null);
  readonly boardElementsService = inject(BoardElementsService);

  @HostBinding('style.outline')
  outline: CSSStyleDeclaration['outline'] = 'none';

  constructor() {
    effect(() => {
      const activeElement = this.boardElementsService.activeElement();

      this.outline =
        activeElement?.id === this.boardElement.id ? 'auto' : 'none';
    });
  }

  ngOnInit() {
    dynamicComponents[this.boardElement.type]().then((component) => {
      this.dynamicComponent.set(component);
    });
  }
}
