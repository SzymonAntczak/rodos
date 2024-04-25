import { Injectable, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { CollectionName, StorageService, type DTO } from './storage.service';

export type BoardElementDTO = DTO & {
  type: 'grass' | 'concreteSlab';
  options: {
    left: number | null;
    right: number | null;
    top: number | null;
    bottom: number | null;
    width: number;
    height: number;
    layer: number;
  };
};

@Injectable({
  providedIn: 'root',
})
export class BoardElementsService {
  get elements() {
    return this._elements.asReadonly();
  }

  get activeElement() {
    return this._activeElement.asReadonly();
  }

  private readonly _elements = signal<BoardElementDTO[]>([]);
  private readonly _activeElement = signal<BoardElementDTO | null>(null);
  private readonly _storageService = inject(StorageService);

  constructor() {
    this._storageService
      .getItems<BoardElementDTO>(CollectionName.BoardElements)
      .pipe(take(1))
      .subscribe((boardElementsDTO) => {
        this._elements.set(boardElementsDTO);
      });
  }

  addElement(
    componentType: BoardElementDTO['type'],
    initialOptions?: BoardElementDTO['options'],
  ): void {
    this._storageService
      .createItem<BoardElementDTO>(CollectionName.BoardElements, {
        type: componentType,
        options: initialOptions ?? {
          left: 0,
          right: null,
          top: null,
          bottom: 0,
          width: 1,
          height: 1,
          layer: 0,
        },
      })
      .pipe(take(1))
      .subscribe((boardElementDTO) => {
        this._elements.update((elements) => [...elements, boardElementDTO]);
        this._activeElement.set(boardElementDTO);
      });
  }

  toggleActiveElement(id: BoardElementDTO['id']): void {
    const element = this._elements().find((element) => element.id === id);

    if (!element) throw new Error('Element not found');

    this._activeElement.update((prevActiveElement) => {
      if (!prevActiveElement) return element;

      this._elements.update((elements) =>
        elements.map((element) =>
          element.id === prevActiveElement.id ? prevActiveElement : element,
        ),
      );

      this.saveElement(prevActiveElement);

      return prevActiveElement.id === element.id ? null : element;
    });
  }

  updateActiveElementOptions(
    options: Partial<BoardElementDTO['options']>,
  ): void {
    this._activeElement.update((element) => {
      if (!element) return element;

      return {
        ...element,
        options: { ...element.options, ...options },
      };
    });
  }

  saveElement({ id, options }: BoardElementDTO): void {
    this._storageService
      .updateItem<BoardElementDTO>(CollectionName.BoardElements, id, {
        options,
      })
      .pipe(take(1))
      .subscribe(() => {
        console.log('Element saved');
      });
  }
}
