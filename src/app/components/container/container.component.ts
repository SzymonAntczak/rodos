import {
  Component,
  HostListener,
  ViewChild,
  signal,
  type AfterViewInit,
  type ElementRef,
} from '@angular/core';
import { BoardElementToolbarComponent } from '../board-element-toolbar/board-element-toolbar.component';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [BoardComponent, BoardElementToolbarComponent],
  templateUrl: './container.component.html',
})
export class ContainerComponent implements AfterViewInit {
  readonly boardContainerSize = signal<{
    width: number;
    height: number;
  } | null>(null);

  @ViewChild('boardContainer') boardContainer?: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setBoardContainerSize();
  }

  ngAfterViewInit() {
    this.setBoardContainerSize();
  }

  private setBoardContainerSize() {
    if (!this.boardContainer) throw new Error('Board container not found');

    this.boardContainerSize.set({
      width: this.boardContainer.nativeElement.offsetWidth,
      height: this.boardContainer.nativeElement.offsetHeight,
    });
  }
}
