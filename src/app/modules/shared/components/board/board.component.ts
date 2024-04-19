import {
  Component,
  HostListener,
  ViewChild,
  inject,
  signal,
  type AfterViewInit,
  type ElementRef,
} from '@angular/core';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
})
export class BoardComponent implements AfterViewInit {
  readonly boardService = inject(BoardService);
  readonly boardStyle = signal<Partial<CSSStyleDeclaration>>({});

  @ViewChild('boardContainer', { static: true })
  private readonly boardContainer?: ElementRef<HTMLDivElement>;

  @ViewChild('board', { static: true })
  private readonly board?: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setBoardStyle().then(() => {
      this.updateBoardSize();
    });
  }

  ngAfterViewInit() {
    this.setBoardStyle().then(() => {
      this.updateBoardSize();
    });
  }

  private setBoardStyle(): Promise<void> {
    return new Promise((resolve) => {
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

      resolve();
    });
  }

  private updateBoardSize() {
    if (!this.board) throw new Error('Board element not found');

    const { offsetWidth: boardWidth, offsetHeight: boardHeight } =
      this.board.nativeElement;

    this.boardService.size.update((size) => ({
      ...size,
      width: boardWidth,
      height: boardHeight,
    }));
  }
}
