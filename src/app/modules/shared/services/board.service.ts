import { Injectable, computed, signal } from '@angular/core';

export type BoardSize = {
  width: number;
  height: number;
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly size = signal<BoardSize>({
    width: 17.5,
    height: 17,
  });

  readonly aspectRatio = computed<number>(() => {
    const { width, height } = this.size();
    return width / height;
  });
}
