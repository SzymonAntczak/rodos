import { NgComponentOutlet } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { BoardComponent } from '../../../shared/components/board/board.component';
import {
  BoardElementsService,
  type BoardElementDTO,
} from '../../../shared/services/board-elements.service';
import { BoardService } from '../../../shared/services/board.service';
import { BoardElementToolbarComponent } from '../board-element-toolbar/board-element-toolbar.component';
import { BoardElementComponent } from '../board-element/board-element.component';
import { type ConcreteSlabComponent } from '../board-element/subsoil/concrete-slab/concrete-slab.component';
import { type GrassComponent } from '../board-element/subsoil/grass/grass.component';

type DynamicComponent = typeof GrassComponent | typeof ConcreteSlabComponent;

export const dynamicComponents = {
  grass: () =>
    import('../board-element/subsoil/grass/grass.component').then(
      (m) => m.GrassComponent,
    ),
  concreteSlab: () =>
    import(
      '../board-element/subsoil/concrete-slab/concrete-slab.component'
    ).then((m) => m.ConcreteSlabComponent),
} satisfies Record<BoardElementDTO['type'], () => Promise<DynamicComponent>>;

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    BoardComponent,
    BoardElementToolbarComponent,
    BoardElementComponent,
    NgComponentOutlet,
  ],
  templateUrl: './container.component.html',
})
export class ContainerComponent {
  readonly boardElementsService = inject(BoardElementsService);
  readonly boardService = inject(BoardService);
  readonly dynamicComponents = signal<
    Partial<Record<BoardElementDTO['type'], DynamicComponent>>
  >({});

  constructor() {
    effect(() => {
      const boardElements = this.boardElementsService.elements();

      boardElements.forEach(async ({ type }) => {
        if (this.dynamicComponents()[type]) return;

        const component = await dynamicComponents[type]();

        this.dynamicComponents.update((dynamicComponents) => ({
          ...dynamicComponents,
          [type]: component,
        }));
      });
    });
  }

  getBoardElementPosition(
    options: BoardElementDTO['options'],
  ): Partial<CSSStyleDeclaration> | undefined {
    const { realWidth, realHeight, width, height } = this.boardService.size();

    if (!width || !height) return;

    return {
      left: `${(options.xPosition * width) / realWidth}px`,
      bottom: `${(options.yPosition * height) / realHeight}px`,
      width: `${(options.width * width) / realWidth}px`,
      height: `${(options.height * height) / realHeight}px`,
      zIndex: `${options.layer}`,
    };
  }
}
