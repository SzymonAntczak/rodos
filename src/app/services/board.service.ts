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
  get board() {
    return this._board.asReadonly();
  }

  private readonly _board = signal<BoardDTO | null>(null);
  private readonly _storageService = inject(StorageService);

  constructor() {
    this._storageService
      .getItems<BoardDTO>(CollectionName.Boards)
      .pipe(take(1))
      .subscribe((boardDTO) => {
        this._board.set(boardDTO[0]);
      });
  }

  createBoard(board: Omit<BoardDTO, 'id'>) {
    this._storageService
      .createItem<BoardDTO>(CollectionName.Boards, board)
      .pipe(take(1))
      .subscribe((boardDTO) => {
        this._board.set(boardDTO);
      });
  }

  updateBoard(id: BoardDTO['id'], body: Omit<BoardDTO, 'id'>): void {
    this._storageService
      .updateItem<BoardDTO>(CollectionName.Boards, id, body)
      .pipe(take(1))
      .subscribe((boardDTO) => {
        this._board.set(boardDTO);
      });
  }
}
