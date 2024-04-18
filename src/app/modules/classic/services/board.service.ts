import { Injectable, signal } from '@angular/core';

export type BoardSize = {
  width: number;
  height: number;
};

@Injectable()
export class BoardService {
  readonly size = signal<BoardSize>({
    width: 17.5,
    height: 17,
  });
}
