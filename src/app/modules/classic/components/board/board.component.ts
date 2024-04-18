import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal,
  type AfterViewInit,
  type ElementRef,
} from '@angular/core';
import {
  BoardElementsService,
  type BoardElement,
} from '../../../shared/services/board-elements.service';
import { BoardService } from '../../services/board.service';
import { BoardElementComponent } from './board-elements/board-element.component';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  imports: [NgComponentOutlet, BoardElementComponent],
})
export class BoardComponent implements AfterViewInit {
  readonly boardElementsService = inject(BoardElementsService);
  readonly boardService = inject(BoardService);

  readonly aspectRatio = computed<number>(() => {
    const { width, height } = this.boardService.size();

    return width / height;
  });

  readonly boardStyle = signal<Partial<CSSStyleDeclaration>>({});

  @ViewChild('boardContainer', { static: true })
  boardContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('board', { static: true })
  board!: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setBoardStyle();
  }

  ngAfterViewInit() {
    this.setBoardStyle();
  }

  getElementStyle(
    options: BoardElement['options'],
  ): Partial<CSSStyleDeclaration> {
    const { width: realWidth, height: realHeight } = this.boardService.size();

    const { offsetWidth: boardWidth, offsetHeight: boardHeight } =
      this.board.nativeElement;

    return {
      left: `${(options.xPosition * boardWidth) / realWidth}px`,
      bottom: `${(options.yPosition * boardHeight) / realHeight}px`,
      width: `${(options.width * boardWidth) / realWidth}px`,
      height: `${(options.height * boardHeight) / realHeight}px`,
      zIndex: options.layer.toString(),
    };
  }

  private setBoardStyle() {
    const { offsetWidth: boardWidth, offsetHeight: boardHeight } =
      this.board.nativeElement;

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
