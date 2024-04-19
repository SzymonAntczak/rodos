import { Injectable, computed, signal } from '@angular/core';

export type BoardSize = {
  realWidth: number;
  realHeight: number;
  width?: number;
  height?: number;
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly size = signal<BoardSize>({
    realWidth: 17.5,
    realHeight: 17,
  });

  readonly aspectRatio = computed<number>(() => {
    const { realWidth, realHeight } = this.size();
    return realWidth / realHeight;
  });
}
