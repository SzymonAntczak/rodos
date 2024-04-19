import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  HostListener,
  ViewChild,
  effect,
  inject,
  signal,
  type AfterViewInit,
  type ElementRef,
} from '@angular/core';
import {
  BoardElementsService,
  type BoardElementDTO,
} from '../../../shared/services/board-elements.service';
import { BoardService } from '../../../shared/services/board.service';
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
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  imports: [NgComponentOutlet, BoardElementComponent],
})
export class BoardComponent implements AfterViewInit {
  readonly boardElementsService = inject(BoardElementsService);
  readonly boardService = inject(BoardService);
  readonly boardStyle = signal<Partial<CSSStyleDeclaration>>({});
  readonly dynamicComponents = signal<
    Partial<Record<BoardElementDTO['type'], DynamicComponent>>
  >({});

  @ViewChild('boardContainer', { static: true })
  private readonly boardContainer?: ElementRef<HTMLDivElement>;

  @ViewChild('board', { static: true })
  private readonly board?: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setBoardStyle();
  }

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

  ngAfterViewInit() {
    this.setBoardStyle();
  }

  getElementStyle(
    options: BoardElementDTO['options'],
  ): Partial<CSSStyleDeclaration> {
    const { width: realWidth, height: realHeight } = this.boardService.size();

    if (!this.board) throw new Error('Board element not found');

    const { offsetWidth: boardWidth, offsetHeight: boardHeight } =
      this.board.nativeElement;

    return {
      left: `${(options.xPosition * boardWidth) / realWidth}px`,
      bottom: `${(options.yPosition * boardHeight) / realHeight}px`,
      width: `${(options.width * boardWidth) / realWidth}px`,
      height: `${(options.height * boardHeight) / realHeight}px`,
      zIndex: `${options.layer}`,
    };
  }

  private setBoardStyle(): void {
    if (!this.board) throw new Error('Board element not found');

    const { offsetWidth: boardWidth, offsetHeight: boardHeight } =
      this.board.nativeElement;

    if (!this.boardContainer) throw new Error('Board element not found');

    const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
      this.boardContainer.nativeElement;

    if (boardWidth > containerWidth) {
      this.boardStyle.set({
        width: '100%',
      });
    }

    if (boardHeight > containerHeight) {
      this.boardStyle.set({
        height: '100%',
      });
    }
  }
}
