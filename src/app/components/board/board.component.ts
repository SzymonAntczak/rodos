import {
  Component,
  Input,
  ViewChild,
  computed,
  inject,
  signal,
  type AfterViewInit,
  type ElementRef,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import {
  BoardElementsService,
  type BoardElementDTO,
} from '../../services/board-elements.service';
import { BoardElementComponent } from '../board-element/board-element.component';
import { BoardService, type BoardDTO } from './../../services/board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  imports: [BoardElementComponent],
})
export class BoardComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) containerSize!: { width: number; height: number };

  readonly boardService = inject(BoardService);

  readonly aspectRatio = computed<number>(() => {
    const board = this.boardService.board();

    if (!board) return 1;

    return board.realWidth / board.realHeight;
  });

  readonly boardElementsService = inject(BoardElementsService);
  readonly boardStyle = signal<Partial<CSSStyleDeclaration>>({});

  @ViewChild('board', { static: true })
  private readonly board?: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges) {
    const containerSize = changes['containerSize'];

    if (!containerSize || containerSize.isFirstChange()) return;

    this.setBoardStyle();
  }

  ngAfterViewInit() {
    this.setBoardStyle();
  }

  getBoardElementPosition(
    options: BoardElementDTO['options'],
    { realWidth, realHeight }: BoardDTO,
  ): Partial<CSSStyleDeclaration> | undefined {
    if (!this.board) throw new Error('Board element not found');

    const { offsetWidth: width, offsetHeight: height } =
      this.board.nativeElement;

    return {
      left: `${(options.xPosition * width) / realWidth}px`,
      bottom: `${(options.yPosition * height) / realHeight}px`,
      width: `${(options.width * width) / realWidth}px`,
      height: `${(options.height * height) / realHeight}px`,
      zIndex: `${options.layer}`,
    };
  }

  private setBoardStyle(): void {
    if (!this.board) throw new Error('Board element not found');

    const { offsetWidth: boardWidth, offsetHeight: boardHeight } =
      this.board.nativeElement;

    const padding = 24;

    if (boardWidth + padding >= this.containerSize.width) {
      this.boardStyle.set({
        width: '100%',
      });
    }

    if (boardHeight + padding > this.containerSize.height) {
      this.boardStyle.set({
        height: '100%',
      });
    }
  }
}
