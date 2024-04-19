import { Injectable, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { CollectionName, StorageService, type DTO } from './storage.service';

export type BoardElementDTO = DTO & {
  type: 'grass' | 'concreteSlab';
  options: {
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
    layer: number;
  };
};

@Injectable({
  providedIn: 'root',
})
export class BoardElementsService {
  readonly elements = signal<(BoardElementDTO & { isActive?: boolean })[]>([]);

  private readonly storageService = inject(StorageService);

  constructor() {
    this.storageService
      .getItems<BoardElementDTO>(CollectionName.BoardElements)
      .pipe(take(1))
      .subscribe((boardElementsDTO) => {
        this.elements.set(boardElementsDTO);
      });
  }

  addElement(componentType: BoardElementDTO['type']): void {
    this.storageService
      .createItem<BoardElementDTO>(CollectionName.BoardElements, {
        type: componentType,
        options: {
          xPosition: 0,
          yPosition: 0,
          width: 1,
          height: 1,
          layer: 0,
        },
      })
      .pipe(take(1))
      .subscribe((boardElementDTO) => {
        this.elements.update((elements) => [...elements, boardElementDTO]);
      });
  }

  toggleActiveElement(id: BoardElementDTO['id']): void {
    this.elements.update((elements) =>
      elements.map((element) => {
        element.isActive = element.id === id ? !element.isActive : false;
        return element;
      }),
    );
  }

  updateElementOptions(
    id: BoardElementDTO['id'],
    options: Partial<BoardElementDTO['options']>,
  ): void {
    this.elements.update((elements) =>
      elements.map((element) => {
        element.options =
          element.id === id
            ? { ...element.options, ...options }
            : element.options;

        return element;
      }),
    );
  }
}
