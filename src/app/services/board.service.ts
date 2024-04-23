import { Injectable, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { CollectionName, StorageService, type DTO } from './storage.service';

export type BoardDTO = DTO & {
  realWidth: number;
  realHeight: number;
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly board = signal<BoardDTO | null>(null);

  private readonly storageService = inject(StorageService);

  constructor() {
    this.storageService
      .getItems<BoardDTO>(CollectionName.Boards)
      .pipe(take(1))
      .subscribe((boardDTO) => {
        this.board.set(boardDTO[0]);
      });
  }

  createBoard(board: Omit<BoardDTO, 'id'>) {
    this.storageService
      .createItem<BoardDTO>(CollectionName.Boards, board)
      .pipe(take(1))
      .subscribe((boardDTO) => {
        this.board.set(boardDTO);
      });
  }

  updateBoard(id: BoardDTO['id'], body: Omit<BoardDTO, 'id'>): void {
    this.storageService
      .updateItem<BoardDTO>(CollectionName.Boards, id, body)
      .pipe(take(1))
      .subscribe((boardDTO) => {
        this.board.set(boardDTO);
      });
  }
}
